import Media from '../models/Media.js'

export const getMedia = async (id) => await Media.findById(id)

export const saveMedia = async ({
	filename,
	url,
	public_id,
	resource_type,
	format,
	size,
	uploader,
} = {}) =>
	await new Media({ filename, url, public_id, resource_type, format, size, uploader }).save()

export const deleteMedia = async (media) => await media.deleteOne()
export const deleteMediaById = async (mediaId) => await Media.findByIdAndDelete(mediaId)
