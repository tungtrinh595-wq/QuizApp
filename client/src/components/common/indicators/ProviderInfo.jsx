import { PROVIDER } from '@/constants'
import { EnvelopeIcon, FacebookIcon, GoogleIcon } from '@/assets/icons'

const ProviderInfo = ({ provider }) => {
	if (provider === PROVIDER.EMAIL.value)
		return (
			<>
				<EnvelopeIcon />
				<span>Email</span>
			</>
		)

	if (provider === PROVIDER.GOOGLE.value)
		return (
			<>
				<GoogleIcon />
				<span>Google</span>
			</>
		)

	if (provider === PROVIDER.FACEBOOK.value)
		return (
			<>
				<FacebookIcon />
				<span>Facebook</span>
			</>
		)

	return <span>{provider}</span>
}

export default ProviderInfo
