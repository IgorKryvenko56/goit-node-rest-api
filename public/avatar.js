document.addEventListener('DOMContentLoaded', async () => {
    const userId = '662ab72adb33087468e3ce92'; // ID of the user whose avatar you want to display

    try {
        const response = await fetch(`/api/users/${userId}`); // Assuming you have an API endpoint to fetch user data
        const userData = await response.json();

        const userAvatarUrl = userData.avatarURL || '/path/to/default-avatar.jpg'; // Default avatar URL if user has no avatar

        const userAvatarImg = document.getElementById('userAvatar');
        userAvatarImg.src = userAvatarUrl;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
});