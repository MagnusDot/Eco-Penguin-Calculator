import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import AppHeader from "./Layouts/AppHeader";
import AppFooter from "./Layouts/AppFooter";


Vue.use(Router);

export default new Router({
    mode: "history",
    hashbang: false,
    abstract: true,
    hash: false,
    base: "/",
    linkExactActiveClass: "active",
    root: "/",
    routes: [
        {
            path: "/",
            name: "Index",
            components: {
                header: AppHeader,
                default: Home,
                footer: AppFooter
            }
        },
        { path: "*", redirect: "/" }
    ],
    scrollBehavior: to => {
        if (to.hash) {
            return { selector: to.hash };
        } else {
            return { x: 0, y: 0 };
        }
    }
});
