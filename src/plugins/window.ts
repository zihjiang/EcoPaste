import type { WindowLabel } from "@/types/plugin";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import {
	LogicalPosition,
	LogicalSize,
	currentMonitor,
} from "@tauri-apps/api/window";

const COMMAND = {
	SHOW_WINDOW: "plugin:eco-window|show_window",
	HIDE_WINDOW: "plugin:eco-window|hide_window",
	SHOW_TASKBAR_ICON: "plugin:eco-window|show_taskbar_icon",
};

/**
 * 显示窗口
 */
export const showWindow = (label?: WindowLabel) => {
	if (label) {
		emit(LISTEN_KEY.SHOW_WINDOW, label);
	} else {
		invoke(COMMAND.SHOW_WINDOW);
	}
};

/**
 * 隐藏窗口
 */
export const hideWindow = () => {
	invoke(COMMAND.HIDE_WINDOW);
};

/**
 * 切换窗口的显示和隐藏
 */
export const toggleWindowVisible = async () => {
	const appWindow = getCurrentWebviewWindow();

	let focused = await appWindow.isFocused();

	if (isLinux) {
		focused = await appWindow.isVisible();
	}

	if (focused) {
		hideWindow();
	} else {
		if (appWindow.label === WINDOW_LABEL.MAIN) {
			const { window } = clipboardStore;

			// 激活时回到顶部
			if (window.backTop) {
				await emit(LISTEN_KEY.ACTIVATE_BACK_TOP);
			}

			// 只有当位置为"bottom"时才使用dock样式（卡片全屏展示）
			if (window.position === "bottom") {
				const monitor = await getCursorMonitor();

				if (monitor) {
					const { width, height } = monitor.size;
					const windowHeight = 400;
					const { x } = monitor.position;
					const y = height - windowHeight;

					await appWindow.setSize(new LogicalSize(width, windowHeight));
					await appWindow.setPosition(new LogicalPosition(x, y));
				}
			} else if (window.position !== "remember") {
				// 其他位置（follow、center）重置为默认窗口尺寸
				const current = await currentMonitor();
				const monitor = await getCursorMonitor();

				if (current && monitor) {
					let { position, size, cursorX, cursorY } = monitor;
					// 重置为默认窗口尺寸，避免保持之前全屏拉伸的宽度
					const defaultWidth = 400;
					const defaultHeight = 600;
					await appWindow.setSize(new LogicalSize(defaultWidth, defaultHeight));
					const { width, height } = {
						width: defaultWidth,
						height: defaultHeight,
					};

					if (window.position === "follow") {
						// 跟随鼠标位置
						cursorX = Math.min(cursorX, position.x + size.width - width);
						cursorY = Math.min(cursorY, position.y + size.height - height);
					} else if (window.position === "center") {
						// 屏幕中心位置
						cursorX = position.x + (size.width - width) / 2;
						cursorY = position.y + (size.height - height) / 2;
					}

					await appWindow.setPosition(
						new LogicalPosition(Math.round(cursorX), Math.round(cursorY)),
					);
				}
			}
		}

		showWindow();
	}
};

/**
 * 显示任务栏图标
 */
export const showTaskbarIcon = (visible = true) => {
	invoke(COMMAND.SHOW_TASKBAR_ICON, { visible });
};
