import { v2 as cloudinary } from 'cloudinary'

export const destroyImgUtility = async (req, res) => {
    try {
        const { publicIds } = req.body
        if (!Array.isArray(publicIds) || publicIds.length === 0) {
            return res.status(400).json({
                message: `Kindly select an image`,
                error: true,
                success: false,
            })
        }

        await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)))
        return res.status(200).json({
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