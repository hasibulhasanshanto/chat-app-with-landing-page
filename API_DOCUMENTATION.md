# Chat API — Documentation

**Base URL:** `https://frontend-task-chatapp.onrender.com/api`
**Auth:** Bearer JWT — send `Authorization: Bearer <token>` on every protected request.
**Real-time:** Socket.io, connects to the root domain (not `/api`). See the Real-time section below.

This document is based on the given API spec plus my own testing of every endpoint against the given swagger documentation — response shapes, status codes, and a few behaviors that weren't specified up front are documented below as I found them.

## Table of Contents

- [Auth](#auth)
- [Users](#users)
- [Conversations](#conversations)
- [Groups](#groups)
- [Messages](#messages)
- [System](#system)
- [Real-time — WebSocket (Socket.io)](#real-time--websocket-socketio)
- [Known Issues / Observations](#known-issues--observations)

---

## Auth

### `POST /auth/login`

Single endpoint for both login and signup. If the phone number is new, it registers automatically; if it already exists, it logs that user in.

**Auth required:** No

**Request Body**
| Field | Type | Required | Example |
|-------|--------|----------|----------------------|
| phone | string | yes | `"+8801712345678"` |
| name | string | yes | `"Rafi Ahmed"` |

```json
// Request
{ "phone": "+8801712345678", "name": "Rafi Ahmed" }
```

```json
// Response — 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a885720e5d6aac97522508d",
    "name": "Rafi Ahmed",
    "phone": "+8801712345678",
    "createdAt": "2026-08-21T13:48:16.809Z"
  }
}
```

**Notes**

- The user object uses Mongo-style `_id`, not `id`.
- Both a fresh registration and a normal login return `200 OK` — there's no `201` or `isNewUser` flag to distinguish the two from the response alone.
- Logging in with an existing phone but a different `name` silently updates the stored name (`_id` and `createdAt` stay the same). There's no confirmation step, so a returning user typing a different name on a new device will have their name changed everywhere.

---

### `GET /auth/me`

Returns the user tied to the current token. Used to restore a session on reload.

**Auth required:** Yes

```json
// Response — 200 OK
{
  "_id": "6a885720e5d6aac97522508d",
  "name": "Rafi Changed",
  "phone": "+8801712345678",
  "createdAt": "2026-08-21T13:48:16.809Z"
}
```

**Notes**

- Same fields as `/auth/login`'s `user` object, but returned flat (no `user` wrapper).
- A missing or invalid token returns `400 Bad Request` (not the more conventional `401`), with a consistent error shape:
  ```json
  {
    "error": {
      "message": "No token provided",
      "code": "NO_TOKEN"
    }
  }
  ```
  Auth-check logic should branch on `error.code === "NO_TOKEN"` rather than relying on the status code.

---

## Users

### `GET /users/search?q={query}`

Search users by name. Used for starting a new conversation.

**Auth required:** Yes

**Query Params**
| Param | Type | Required | Example |
|-------|--------|----------|---------|
| q | string | yes | `"Ada"` |

```json
// Response — 200 OK
[
  {
    "_id": "6a88275de5d6aac97521e37a",
    "name": "Ada Test",
    "phone": "+15550001111"
  },
  {
    "_id": "6a8827fde5d6aac97521e494",
    "name": "Ada Lovelace",
    "phone": "+15551111111"
  }
]
```

**Notes**

- Returns a plain array (not wrapped in an object).
- Matching is **case-sensitive**: `q=Ada` and `q=ada` return different, non-overlapping result sets. Normalize case client-side if case-insensitive search is desired.
- Despite the spec describing this as "name or phone," it does **not** match on phone number — searching a real, existing phone number (with or without the leading `+`) returns an empty array. Treat this as name-only search.

---

## Conversations

### `GET /conversations`

Lists every conversation (direct + group) the current user is part of.

**Auth required:** Yes

```json
// Response — 200 OK
{
  "data": [
    {
      "_id": "6a888acbe5d6aac97523a884",
      "type": "group",
      "lastMessage": {
        "text": "Yes i am here",
        "sender": "6a8897e2e5d6aac97524037b",
        "createdAt": "2026-08-21T18:40:29.070Z"
      },
      "updatedAt": "2026-08-21T18:40:29.305Z",
      "name": "Personal Group",
      "createdBy": "6a885720e5d6aac97522508d",
      "admins": ["6a885720e5d6aac97522508d"],
      "participants": [
        {
          "_id": "6a885720e5d6aac97522508d",
          "name": "Rahmat",
          "phone": "+8801712345678"
        },
        {
          "_id": "6a8897e2e5d6aac97524037b",
          "name": "Kazi Rahamatullah",
          "phone": "+8802222222222"
        }
      ]
    },
    {
      "_id": "6a88586de5d6aac975225a1d",
      "type": "direct",
      "lastMessage": {
        "text": "hi",
        "sender": "6a885720e5d6aac97522508d",
        "createdAt": "2026-08-21T17:36:54.635Z"
      },
      "updatedAt": "2026-08-21T17:36:54.878Z",
      "participant": {
        "_id": "6a885722e5d6aac9752250a5",
        "name": "Chat Test Charlie",
        "phone": "+8801712345680"
      }
    }
  ]
}
```

**Notes**

- Response is wrapped in `{ "data": [...] }`, unlike `/users/search`, which returns a plain array.
- Sorted by `updatedAt` descending — most recently active conversation first. `updatedAt` isn't only bumped by new messages (e.g. a group edit can move a conversation to the top without a new message).
- `direct` and `group` items have different shapes: `group` has `participants` (array, includes the current user), `admins`, and `name`. `direct` has a single `participant` object — the _other_ person only — and no `name` field. The frontend needs to branch on `type` when rendering a conversation's title.
- `lastMessage` can be an empty object `{}` for a conversation with no messages sent yet.

---

### `POST /conversations`

Starts a 1-to-1 conversation with another user.

**Auth required:** Yes

**Request Body**
| Field | Type | Required | Description |
|--------|--------|----------|---------------------------------------------|
| userId | string | yes | The other user's id, from `/users/search` |

```json
// Request
{ "userId": "6a883b5ee5d6aac97522047c" }
```

```json
// Response — 200 OK
{
  "_id": "6a886e09e5d6aac97522d6c9",
  "participants": ["6a885720e5d6aac97522508d", "6a883b5ee5d6aac97522047c"],
  "createdAt": "2026-08-21T15:26:01.877Z"
}
```

**Notes**

- This response is noticeably thinner than `GET /conversations`: no `type`, no `updatedAt`, no `lastMessage`, and `participants` is an array of plain id strings rather than full user objects.
- Because of that, the response can't be rendered directly into a conversation-list row — either re-fetch `GET /conversations`, or construct the row client-side using the other user's details from `/users/search`.

---

### `GET /conversations/{id}/messages`

Message history for one conversation, paginated for infinite-scroll.

**Auth required:** Yes

**Path Params:** `id` — conversation id
**Query Params:** `limit` (optional, e.g. `20`), `before` (optional cursor for older messages)

```json
// Response — 200 OK
{
  "messages": [
    {
      "_id": "6a888cb6e5d6aac97523b417",
      "conversation": "6a88586de5d6aac975225a1d",
      "sender": "6a885720e5d6aac97522508d",
      "text": "hi",
      "createdAt": "2026-08-21T17:36:54.635Z"
    }
  ],
  "hasMore": false
}
```

**Notes**

- Wrapped in `{ "messages": [...] }` — a third distinct list-wrapping style on this API, alongside the plain array from `/users/search` and the `{ "data": [...] }` wrapper from `/conversations`.
- `hasMore` is an explicit boolean, so pagination doesn't need to be inferred from whether exactly `limit` items came back.
- `sender` is just an id, not a full user object — resolve it against the conversation's `participants`/`participant`.

---

## Groups

### `POST /conversations/group`

Creates a group conversation. The creator automatically becomes a participant and admin.

**Auth required:** Yes

**Request Body**
| Field | Type | Required | Example |
|----------------|----------|----------|-----------------------------------|
| name | string | yes | `"Project Team"` |
| participantIds | string[] | yes | ids of members besides yourself |

```json
// Request
{ "name": "Project Team", "participantIds": ["id1", "id2"] }
```

```json
// Response — 201 Created
{
  "_id": "6a889fade5d6aac975244189",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a885720e5d6aac97522508d",
  "admins": ["6a885720e5d6aac97522508d"],
  "participants": [
    {
      "_id": "6a885720e5d6aac97522508d",
      "name": "MD FARUKUL ISLAM",
      "phone": "+8801712345678"
    },
    {
      "_id": "6a8827fde5d6aac97521e494",
      "name": "Ada Lovelace",
      "phone": "+15551111111"
    }
  ],
  "createdAt": "2026-08-21T18:57:49.870Z",
  "updatedAt": "2026-08-21T18:57:49.870Z"
}
```

**Notes**

- A group requires **at least 3 total members** (the creator plus 2 in `participantIds`). Fewer returns:
  ```json
  // 400 Bad Request
  {
    "error": {
      "message": "Validation failed",
      "code": "VALIDATION_ERROR",
      "details": [
        {
          "path": "participantIds",
          "message": "a group needs at least 3 members"
        }
      ]
    }
  }
  ```
  This minimum isn't mentioned in the given spec — enforce it client-side too.
- Unlike `POST /conversations` (direct), this returns `201 Created` and the full, rich object — ready to render straight into a conversation list without a re-fetch.
- The creator is auto-added to `participants` even though they weren't in `participantIds`, and is the sole entry in `admins`.

---

### `POST /conversations/{id}/participants` — Add members

**Admins only.**

**Request Body**
| Field | Type | Required |
|---------|----------|----------|
| userIds | string[] | yes |

```json
// Response — 200 OK — returns the full, updated group object
{
  "_id": "6a889fade5d6aac975244189",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a885720e5d6aac97522508d",
  "admins": ["6a885720e5d6aac97522508d"],
  "participants": [
    {
      "_id": "6a885720e5d6aac97522508d",
      "name": "MD FARUKUL ISLAM",
      "phone": "+8801712345678"
    },
    {
      "_id": "6a883776e5d6aac97521f97b",
      "name": "Ada Updated",
      "phone": "+15551234100"
    }
  ],
  "createdAt": "2026-08-21T18:57:49.870Z",
  "updatedAt": "2026-08-21T19:01:45.062Z"
}
```

Adding a member bumps `updatedAt`. The response can be swapped straight into local state.

---

### `DELETE /conversations/{id}/participants/{userId}` — Remove member / leave group

**Admins only, unless `userId` in the path is your own** — then it's leaving the group.

```json
// Response — 200 OK — returns the full, updated group object
{
  "_id": "6a889fade5d6aac975244189",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a885720e5d6aac97522508d",
  "admins": ["6a885720e5d6aac97522508d"],
  "participants": [
    {
      "_id": "6a885720e5d6aac97522508d",
      "name": "MD FARUKUL ISLAM",
      "phone": "+8801712345678"
    }
  ],
  "createdAt": "2026-08-21T18:57:49.870Z",
  "updatedAt": "2026-08-21T19:03:09.718Z"
}
```

Same full-object response pattern as Add Members — the removed member is gone from `participants` and `updatedAt` bumps.

---

### `POST /conversations/{id}/admins` — Promote to admin

**Admins only.**

**Request Body**
| Field | Type | Required |
|--------|--------|----------|
| userId | string | yes |

The target user must already be a member of the group — promoting someone who isn't returns:

```json
// 400 Bad Request
{
  "error": {
    "message": "Target user is not a member of this group",
    "code": "NOT_A_MEMBER"
  }
}
```

---

### `PATCH /conversations/{id}` — Rename group

**Admins only.**

**Request Body**
| Field | Type | Required |
|-------|--------|----------|
| name | string | yes |

```json
// Response — 200 OK — returns the full, updated group object
{
  "_id": "6a889fade5d6aac975244189",
  "type": "group",
  "name": "Renamed Team",
  "createdBy": "6a885720e5d6aac97522508d",
  "admins": ["6a885720e5d6aac97522508d"],
  "participants": [
    {
      "_id": "6a885720e5d6aac97522508d",
      "name": "MD FARUKUL ISLAM",
      "phone": "+8801712345678"
    }
  ],
  "createdAt": "2026-08-21T18:57:49.870Z",
  "updatedAt": "2026-08-21T19:13:27.747Z"
}
```

All four group-mutation endpoints above (add, remove, promote, rename) follow the same pattern: full group object back, `updatedAt` bumped. One shared piece of frontend logic — "replace local group state with the response" — covers all of them.

---

## Messages

### `POST /messages`

Sends a message into a conversation. Also delivered to other participants in real time via the `message:new` Socket.io event.

**Auth required:** Yes

**Request Body**
| Field | Type | Required |
|----------------|--------|----------|
| conversationId | string | yes |
| text | string | yes |

```json
// Request
{ "conversationId": "6a88586de5d6aac975225a1d", "text": "Hello!" }
```

```json
// Response — 200 OK
{
  "_id": "6a88a38fe5d6aac975246583",
  "conversation": "6a88586de5d6aac975225a1d",
  "sender": "6a885720e5d6aac97522508d",
  "text": "Hello!",
  "createdAt": "2026-08-21T19:14:23.435Z"
}
```

**Notes**

- The response already includes the real `_id` and `createdAt` — no need to wait for the `message:new` socket event just to get them. Optimistic sending can show the message instantly, then swap in this response's `_id`/`createdAt` once it arrives, and rely on `message:new` only for messages from other participants (with de-duping against your own sent messages).

---

## System

### `GET /health`

No-auth health check, intended as an "is the server awake" ping for the Render cold-start delay.

**Auth required:** No

```json
// Response — 404 Not Found
{
  "error": {
    "message": "Route not found",
    "code": "NOT_FOUND"
  }
}
```

This route does not actually exist on the live server. Don't build a connectivity check around it — use a real endpoint (e.g. `GET /auth/me`, which will still respond even without a token) if a lightweight ping is needed.

---

## Real-time — WebSocket (Socket.io)

Separate from the REST endpoints above — connects to the server's root address, not `/api`:

```js
import { io } from "socket.io-client";

const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: { token }, // the same JWT from /auth/login
});
```

The token must be passed at connection time (inside `auth`), not after — a missing or invalid token is rejected at connection.

**Events**

| Direction       | Event                  | Payload                                                         | Meaning                                          |
| --------------- | ---------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| client → server | `message:send`         | `{ conversationId, text }`                                      | Alternative way to send a message (besides REST) |
| server → client | `message:new`          | Same shape as the message object from `POST /messages`          | A new message arrived                            |
| server → client | `conversation:updated` | Group object (same shape as the group-mutation responses above) | A group you're in changed                        |

**Recommended approach:** send messages via `POST /messages` (simpler error handling, works naturally with optimistic UI) and receive new messages via the `message:new` socket event, rather than sending through the socket too. Keeping "how you send" and "how you receive" on two separate channels is easier to reason about than mixing both directions through the socket.

---

## Known Issues / Observations

- User objects use `_id` (Mongo-style), not `id` — inconsistent with what most REST APIs default to.
- `POST /auth/login` doubles as an implicit "update my name": logging in with an existing phone and a new name silently overwrites the stored name, with no distinct status code or flag.
- Both fresh registration and normal login return the same `200 OK` — there's no way to tell from the response alone whether an account was just created.
- `POST /auth/login` wraps the user object as `{ "user": {...} }`, but `GET /auth/me` returns the same fields flat.
- A missing/invalid token on a protected route returns `400 Bad Request` instead of the more conventional `401 Unauthorized`. The error shape is consistent (`{ error: { message, code } }`) and safer to branch on than the status code.
- `GET /users/search` is case-sensitive — `q=Ada` and `q=ada` return disjoint result sets.
- `GET /users/search` doesn't actually search by phone despite the spec description — tried both with and without the leading `+`, both returned `[]`. Effectively name-only search.
- List-response wrapping is inconsistent across three styles: `GET /users/search` returns a plain array, `GET /conversations` wraps in `{ "data": [...] }`, and `GET /conversations/{id}/messages` wraps in `{ "messages": [...] }`.
- `direct` vs `group` conversation objects have different shapes: `group` has `participants` (array, includes yourself) and `name`; `direct` has a single `participant` object (the other person only) and no `name`.
- `lastMessage` can be an empty object `{}` on a conversation with no messages yet.
- `updatedAt` on a conversation reacts to more than just new messages — group edits (membership changes, renames) also bump it.
- `POST /conversations/group` requires at least 3 total members — an undocumented validation rule, enforced with a `400 VALIDATION_ERROR`.
- Status codes are inconsistent across "create" endpoints: `POST /conversations/group` correctly returns `201`, but `POST /auth/login` and `POST /conversations` (direct) return `200` even when creating something new.
- `GET /health` is documented but does not exist on the live server (`404 NOT_FOUND`).
