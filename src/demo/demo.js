import { Router } from "../material/router/router";

import DemoMainComponent from "./main/main.js";
const DemoBlogsLoad = () => import("./blogs/blogs.js").then((m) => m.default);
const DemoBlogLoad = () => import("./blog/blog.js").then((m) => m.default);
const DemoUsersLoad = () => import("./users/users.js").then((m) => m.default);
const DemoUserLoad = () => import("./user/user.js").then((m) => m.default);
const DemoErrorLoad = () => import("./error/error.js").then((m) => m.default);

const beforeLoad = (next) => {
    next();
    // // emulate pending request
    // setTimeout(() => {
    //     next()
    // },3*1000)
};

Router.init([
    {
        path: "",
        component: DemoMainComponent,
        children: [
            {
                path: "blogs",
                load: DemoBlogsLoad,
                children: [{ path: ":id", load: DemoBlogLoad, children: [] }],
            },
            {
                path: "users",
                load: DemoUsersLoad,
                beforeLoad,
                children: [{ path: ":id", load: DemoUserLoad, outlet: "user", children: [] }],
            },
        ],
    },
    { path: "*", load: DemoErrorLoad, children: [] },
]);
