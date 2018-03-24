"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express_1 = require("express");
const users = [
    {
        imageUrl: '/public/gil.jpg',
        userId: '1',
        userName: 'Gil Amran'
    },
    {
        imageUrl: '/public/noa.jpg',
        userId: '2',
        userName: 'Noa Tevel'
    },
    {
        imageUrl: '/public/john.jpg',
        userId: '3',
        userName: 'John Doe'
    }
];
function apiRouter() {
    const router = express_1.Router();
    router.use(bodyParser.json());
    router.get('/api/users', (req, res) => {
        res.json(users);
    });
    router.get('/api/user/:userId', (req, res) => {
        const userId = req.params.userId;
        const user = users.find(u => u.userId === userId);
        res.json(user);
    });
    router.post('/api/set-user', (req, res) => {
        res.send(`ok`);
    });
    router.post('/api/sign-in', (req, res) => {
        const reply = {
            error: '',
            isOk: true,
            user: {
                imageUrl: '',
                userId: 'testUserId',
                userName: 'testUserName'
            }
        };
        res.send(reply);
    });
    return router;
}
exports.apiRouter = apiRouter;
//# sourceMappingURL=api-router.js.map