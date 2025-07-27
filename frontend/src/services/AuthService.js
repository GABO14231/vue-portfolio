import {ref} from 'vue';

class AuthService
{
    baseUrl = 'https://localhost:3000';
    _user = ref(null);
    _authInitialized = ref(false);
    user = this._user;
    authInitialized = this._authInitialized;

    constructor() {this.checkSession()}
    async checkSession()
    {
        try
        {
            const response = await fetch(`${this.baseUrl}/session`,
            {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok)
            {
                const data = await response.json();
                if (data.status === 'success' && data.user) this._user.value = data.user;
                else this._user.value = null;
            }
            else
            {
                console.error('Session check failed with status:', response.status);
                this._user.value = null;
            }
        }
        catch (err)
        {
            console.error('Session check failed (network error or unexpected response):', err);
            this._user.value = null;
        }
        finally {this._authInitialized.value = true;}
    }

    async login(identifier, password)
    {
        const response = await fetch(`${this.baseUrl}/login`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ identifier, password }),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok && data.status === 'success') await this.checkSession();
        return data;
    }

    async logout()
    {
        const response = await fetch(`${this.baseUrl}/logout`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({}),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) this._user.value = null;
        return data;
    }

    isAuthenticated() {return !!this._user.value;}
    updateUser(user) {this._user.value = user;}
}

export const authService = new AuthService();