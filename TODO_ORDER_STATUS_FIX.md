# TODO: Fix /api/orders/:id/status Not Found

- [ ] Add missing user route for order status in `BackEnd/routes/orders.js`:
  - [ ] Implement `GET /api/orders/:id/status` (or match the frontend’s method) behind `protect`
  - [ ] Return `orderStatus` and `paymentStatus` (at least the fields the frontend needs)
- [ ] Run backend lint/tests (or start server) and verify route no longer 404s
- [ ] (If needed) Update frontend thunk/call to use existing route(s) instead

