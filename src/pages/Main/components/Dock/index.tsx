import UnoIcon from "@/components/UnoIcon";
import { showWindow } from "@/plugins/window";
import { clipboardStore } from "@/stores/clipboard";
import { Flex } from "antd";
import clsx from "clsx";
import { useSnapshot } from "valtio";
import Group from "../Group";
import List from "../List";
import Pin from "../Pin";
import Search from "../Search";

const Dock = () => {
	const { search } = useSnapshot(clipboardStore);

	return (
		<div className="h-screen rounded-t-2xl bg-color-1">
			<Flex
				data-tauri-drag-region
				vertical
				gap={12}
				className={clsx("h-full py-3", {
					"flex-col-reverse": search.position === "bottom",
				})}
			>
				<Search className="mx-3" />

				<Flex
					data-tauri-drag-region
					vertical
					gap={12}
					className="flex-1 overflow-hidden"
				>
					<Flex
						data-tauri-drag-region
						align="center"
						justify="space-between"
						gap="small"
						className="px-3"
					>
						<Group />

						<Flex align="center" gap={4} className="text-color-2 text-lg">
							<Pin />

							<UnoIcon
								hoverable
								name="i-lets-icons:setting-alt-line"
								onClick={() => {
									showWindow("preference");
								}}
							/>
						</Flex>
					</Flex>

					<List />
				</Flex>
			</Flex>
		</div>
	);
};

export default Dock;
