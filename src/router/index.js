import { createRouter, createWebHashHistory } from 'vue-router'
import Nurse from '../views/Nurse.vue'

const routes = [
    {
        path: '/',
        name: 'Nurse',
        component: Nurse
    },
    {
        path: '/patient',
        name: 'Patient',
        component: () => import('../views/Patient.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
