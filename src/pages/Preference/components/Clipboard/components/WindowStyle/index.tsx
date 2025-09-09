import ProSelect from "@/components/ProSelect";
import type { ClipboardStore } from "@/types/store";
import { useSnapshot } from "valtio";

interface Option {
	label: string;
	value: ClipboardStore["window"]["style"];
}

const WindowStyle = () => {
	const { window } = useSnapshot(clipboardStore);
	const { t } = useTranslation();

	const options: Option[] = [
		{
			label: t("preference.clipboard.window_settings.label.window_style_float"),
			value: "float",
		},
		{
			label: t("preference.clipboard.window_settings.label.window_style_dock"),
			value: "dock",
		},
	];

	return (
		<ProSelect
			title={t("preference.clipboard.window_settings.label.window_style")}
			value={window.style}
			options={options}
			onChange={(value) => {
				clipboardStore.window.style = value;
			}}
		/>
	);
};

export default WindowStyle;
