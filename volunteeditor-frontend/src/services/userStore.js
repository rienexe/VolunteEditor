import { reactive } from 'vue';



const role = localStorage.getItem('role') || 'guest';
const id = localStorage.getItem('id') || null;
const name = localStorage.getItem('name') || null;
const orgName = localStorage.getItem('orgName') || null;

export const userStore = reactive({
    role: role,
    id: id,
    name: name,
    orgName: orgName,

    loginAs(role, id, name, orgName) {
        this.role = role;
        this.id = id;
        this.name = name;
        this.orgName = orgName;

        localStorage.setItem('role', role);
        localStorage.setItem('id', id);
        localStorage.setItem('name', name);
        localStorage.setItem('orgName', orgName);
    },

    logout() {
        this.role = 'guest';
        this.id = null;
        this.name = null;
        this.orgName = null;

        localStorage.setItem('role', this.role);
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('orgName');
    }
})
