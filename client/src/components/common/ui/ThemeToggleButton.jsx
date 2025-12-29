import { DarkThemeSwitchIcon, LightThemeSwitchIcon } from '@/assets/icons'
import { useTheme } from '@/contexts'
import { getThemeSwitch } from '@/utils'
import { Tooltip } from '@/components'

const ThemeToggleButton = () => {
	const { theme, toggleTheme } = useTheme()

	return (
		<Tooltip
			content={`Chế độ hiển thị: ${getThemeSwitch(theme)}`}
			position="bottom"
			tooltipMaxWidth="inherit"
			className="whitespace-nowrap"
		>
			<button
				onClick={toggleTheme}
				className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
			>
				<LightThemeSwitchIcon />
				<DarkThemeSwitchIcon />
			</button>
		</Tooltip>
	)
}

export default ThemeToggleButton
