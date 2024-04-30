import { ImageService } from "./imageService"

export const updateMeService = async (userData, user, file) => {
    if (file) {
        user.avatar =await ImageService.saveImage(file, {
            maxFileSize: 2,
            width: 400,
            height: 400,
        },
        'avatars',
        'users',
        'userId'
        );
    }
    Object.keys(userData).forEach((key) => {
        user[key] = userData[key];
    });
    return user.save();
};