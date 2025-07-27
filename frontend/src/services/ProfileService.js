class ProfileService
{
    baseUrl = 'https://localhost:3000';
    async registerUser(input)
    {
        const response = await fetch(`${this.baseUrl}/register`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(input)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    }

    async loadProfile(form, profileData)
    {
        const response = await fetch(`${this.baseUrl}/${profileData.id}`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Loading profile failed');
        return data;
    }

    async updateCode(id)
    {
        const response = await fetch(`${this.baseUrl}/${id}/updatecode`,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id }),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error updating code.');
        return data;
    }

    async recoverPassword(code, newPassword)
    {
        const response = await fetch(`${this.baseUrl}/recoverpass`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({code, newPassword}),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Recover password failed');
        return data;
    }

    async deleteProfile(password, id)
    {
        const response = await fetch(`${this.baseUrl}/${id}`,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({password}),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Delete profile failed');
        return data;
    }
}

export const profileService = new ProfileService();