import { createRouter, createWebHistory } from 'vue-router';
import { userStore } from '@/services';

import Home from '@/views/Home.vue';
import OrganisationDashboard from "@/views/OrganisationDashboard.vue";
import OrganisationEditor from "@/views/OrganisationEditor.vue";
import OrganisationList from "@/views/OrganisationList.vue";
import OrganisationSingle from "@/views/OrganisationSingle.vue";
import TaskEditor from "@/views/TaskEditor.vue";
import TaskList from "@/views/TaskList.vue";
import TaskSchemaEditor from "@/views/TaskSchemaEditor.vue";
import TaskSingle from "@/views/TaskSingle.vue";
import WorkflowEditor from "@/views/WorkflowEditor.vue";
import WorkflowTaskAssignment from "@/views/WorkflowTaskAssignment.vue";



const routes = [
    { path: '/', name: 'Startseite', component: Home, meta: { title: 'Startseite' } },
    { path: '/organisation',
        children: [
            { path: 'list', name: 'OrganisationList', component: OrganisationList, meta: { title: 'Organisationen', parent: '/' } },
            { path: ':slug', name: 'Organisation', component: OrganisationSingle, meta: { title: `Organisation`, parent: '/organisation/list' } },
        ]
    },
    { path: '/task',
        children: [
            { path: 'list', name: 'TaskList', component: TaskList, meta: { title: 'Aufgaben', parent: '/' } },
            { path: ':slug', name: 'Task', component: TaskSingle, meta: { title: 'Aufgabe', parent: '/task/list' } },
        ]
    },
    { path: '/org-admin',
        children: [
            { path: '', name: 'OrganisationDashboard', component: OrganisationDashboard, meta: { title: 'Dashboard für Organisationen', parent: '/', requiresRole: 'organisation'} },
            { path: 'organisation/editor', name: 'OrganisationEditor', component: OrganisationEditor, meta: { title: 'Organisationsprofil bearbeiten', parent: '/org-admin', requiresRole: 'organisation' } },
            { path: 'task',
                children: [
                    { path: 'editor/:slug?', name: 'TaskEditor', component: TaskEditor, meta: { title: 'Aufgabe bearbeiten', parent: '/org-admin', requiresRole: 'organisation' } },
                    { path: 'editor/schema/:slug?', name: 'TaskSchemaEditor', component: TaskSchemaEditor, meta: { title: 'Aufgabenstruktur bearbeiten', parent: '/org-admin/task/editor/:slug?', requiresRole: 'organisation' } },
                ]
            },
            { path: 'workflow',
                children: [
                    { path: 'editor/:slug?', name: 'WorkflowEditor', component: WorkflowEditor, meta: { title: 'Workflow', parent: '/org-admin', requiresRole: 'organisation'} },
                    { path: 'task-assignment', name: 'WorkflowTaskAssignment', component: WorkflowTaskAssignment, meta: { title: 'Workflow Aufgaben zuweisen', parent: '/org-admin', requiresRole: 'organisation'} }
                ]
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

router.beforeEach((to, from, next) => {
    const requiredRole = to.meta.requiresRole
    if (!requiredRole || userStore.role === requiredRole) {
        next()
    } else {
        alert('Zugriff verweigert.')
        next('/')
    }

    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta?.title)

    if (nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + ' | VolunteEditor - CIvolunteer'
    } else {
        document.title = 'VolunteEditor - CIvolunteer'
    }
});

export default router