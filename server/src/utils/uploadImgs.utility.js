import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'

export const uploadImgsUtility = async (req, res, key, folderName) => {
    try {
        const images = req.files
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                message: `Kindly upload an image`,
                error: true,
                success: false,
            })
        }

        const imgArr = await Promise.all(
            images.map(async img => {
                const result = await cloudinary.uploader.upload(
                    img.path,
                    {
                        folder: `swiftbasket/${folderName}`,
                        use_filename: true,
                        unique_filename: true,
                        overwrite: false,
                        quality: "auto",
                        fetch_format: "auto"
                    }
                )

                await fs.unlink(img.path)
                if (!result?.secure_url) throw new Error(`Error while uploading ${key} Image`)
                return { 'imgUrl': result.secure_url, 'publicId': result.public_id }
            })
        )

        return res.status(200).json({
            imgArr,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}