import Authentication from "@/core/authentication/Authentication";
import ResetPassword from "@/core/authentication/ResetPassword";
import PipelineExpressionTester from "@/modules/pipelineExpressionTester/PipelineExpressionTester";
import {store} from "@/main";
import {enforceAuthentication,pullSaveUserDataFromLocalStorage,enforceAlreadyAuthenticated,redirectToLoginLocation,removeUserDataFromLocalStorage} from "@/core/utilities/helpersAuth";
import NotFound from "@/core/routes/NotFound";

export const baseRoutes = [
    {
        path: '/home',
        name: 'viewHome',
        component: PipelineExpressionTester,
        beforeEnter(to, from, next) {
            if(store.getters.authenticationEnabled){
                pullSaveUserDataFromLocalStorage();
                enforceAuthentication(next);
            } else {
                removeUserDataFromLocalStorage();
            }
            next();
        }
    },

    {
        path: '/login',
        name: 'viewLogin',
        component: Authentication,
        beforeEnter(to, from, next) {
            if(store.getters.authenticationEnabled){
                pullSaveUserDataFromLocalStorage();
                if(store.getters.isLoggedIn){
                    return next(store.getters.redirects.login);
                } else {
                    store.dispatch('requestUser').then(
                        (response)=>{
                            if(response){
                                enforceAlreadyAuthenticated(next);
                            } else {
                                return next();
                            }
                        },
                        ()=>{
                            return next();
                        }
                    )
                }
            } else {
                removeUserDataFromLocalStorage();
                redirectToLoginLocation(next);
            }
            next();
        }
    },
    {
        path: '/reset-password',
        name: 'viewResetPassword',
        component: ResetPassword,
        beforeEnter(to, from, next) {
            if(store.getters.authenticationEnabled){
                pullSaveUserDataFromLocalStorage();
            } else {
                removeUserDataFromLocalStorage();
                redirectToLoginLocation(next);
            }
            next();
        }
    },
    {
        path: '*',
        component: NotFound,
        beforeEnter(to, from, next) {
            if(store.getters.authenticationEnabled){
                pullSaveUserDataFromLocalStorage();
                enforceAlreadyAuthenticated(next);
                enforceAuthentication(next);
            } else {
                removeUserDataFromLocalStorage();
            }
            next();
        }
    }
];
