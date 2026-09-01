// ==UserScript==
// @name            ComicRead
// @namespace       ComicRead
// @version         12.10.0
// @description     为漫画站增加双页阅读、翻译等优化体验的增强功能。百合会（记录阅读历史、自动签到等）、百合会新站、E-Hentai（关联外站、快捷收藏、标签染色、识别广告页等）、nhentai（彻底屏蔽漫画、无限滚动）、Yurifans（自动签到）、拷贝漫画(copymanga)（显示最后阅读记录、解锁隐藏漫画）、再漫画、漫画柜(manhuagui)、动漫屋(dm5)、mangabz、komiic、無限動漫、绅士漫画(wnacg)、禁漫天堂、NoyAcg、熱辣漫畫、hanime1、hitomi、hdoujin、SchaleNetwork、nude-moon、HentaiZap、IMHentai、HentaiEra、HentaiEnvy、MangaDex、welovemanga、kisslove(klz9)、Pawchive、kemono、nekohouse、Pixiv、明日方舟泰拉记事社、Postimages、最前線、芸能ヌード、Tachidesk、LANraragi
// @description:en  Add enhanced features to the comic site for optimized experience, including dual-page reading and translation. E-Hentai (Associate nhentai, Quick favorite, Colorize tags, Floating tag list, etc.) | nhentai (Totally block comics, Auto page turning) | hitomi | hdoujin | SchaleNetwork | nude-moon | HentaiZap | IMHentai | HentaiEra | HentaiEnvy | Pawchive | kemono | nekohouse | MangaDex | welovemanga | kisslove(klz9)
// @description:ru  Добавляет расширенные функции для удобства на сайт, такие как двухстраничный режим и перевод.
// @author          hymbz
// @license         AGPL-3.0-or-later
// @noframes
// @match           *://*/*
// @connect         yamibo.com
// @connect         exhentai.org
// @connect         e-hentai.org
// @connect         hath.network
// @connect         nhentai.net
// @connect         gold-usergeneratedcontent.net
// @connect         hypergryph.com
// @connect         mangabz.com
// @connect         schale.network
// @connect         touhou.ai
// @connect         jsdelivr.net
// @connect         npmmirror.com
// @connect         self
// @connect         127.0.0.1
// @connect         *
// @connect         mapi.hotmangasf.com
// @connect         api.2024manga.com
// @connect         mapi.hotmangasd.com
// @connect         mapi.fgjfghkk.club
// @connect         m.manga2025.com
// @connect         www.manga2025.com
// @connect         mapi.hotmangasg.com
// @connect         www.manga2026.xyz
// @connect         api.manga2025.com
// @connect         mapi.elfgjfghkk.club
// @connect         mapi.fgjfghkkcenter.club
// @connect         mapi.copy20.com
// @connect         api.mangacopy.com
// @connect         api.copy3000.com
// @connect         api.2026copy.com
// @connect         api.copy4000.com
// @grant           GM_addElement
// @grant           GM_getResourceText
// @grant           GM_xmlhttpRequest
// @grant           GM.addValueChangeListener
// @grant           GM.removeValueChangeListener
// @grant           GM.getResourceText
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.listValues
// @grant           GM.deleteValue
// @grant           GM.registerMenuCommand
// @grant           GM.unregisterMenuCommand
// @grant           unsafeWindow
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGl0cGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @resource        solid-js https://cdn.jsdelivr.net/npm/solid-js@1.9.8/dist/solid.cjs
// @resource        fflate https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @resource        jsqr https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js
// @resource        comlink https://cdn.jsdelivr.net/npm/comlink@4.4.2/dist/umd/comlink.min.js
// @resource        solid-js|store https://cdn.jsdelivr.net/npm/solid-js@1.9.8/store/dist/store.cjs
// @resource        solid-js|web https://cdn.jsdelivr.net/npm/solid-js@1.9.8/web/dist/web.cjs
// @resource        _tensorflow|tfjs https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js
// @resource        _tensorflow|tfjs-backend-webgpu https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgpu@4.22.0/dist/tf-backend-webgpu.js
// @supportURL      https://github.com/hymbz/ComicReadScript/issues
// @updateURL       https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js
// @downloadURL     https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js
// ==/UserScript==
//#region \0virtual:lib-code
const libCodeMap = {
	"helper/languages": `\n//#region src/helper/languages.ts
const langList = [
	"zh",
	"en",
	"ru"
];
/** 判断传入的字符串是否是支持的语言类型代码 */
const isLanguages = (lang) => Boolean(lang) && langList.includes(lang);
/** 返回浏览器偏好语言 */
const getBrowserLang = () => {
	for (const language of navigator.languages) {
		const matchLang = langList.find((l) => l === language.split("-")[0]);
		if (matchLang) return matchLang;
	}
};
const getSaveLang = () => typeof GM === "undefined" ? "zh" : GM.getValue("@Languages");
const setSaveLang = (val) => typeof GM === "undefined" || GM.setValue("@Languages", val);
const getInitLang = async () => {
	const saveLang = await getSaveLang();
	if (isLanguages(saveLang)) return saveLang;
	const lang = getBrowserLang() ?? "zh";
	setSaveLang(lang);
	return lang;
};
//#endregion
exports.getInitLang = getInitLang;
exports.isLanguages = isLanguages;
exports.langList = langList;
exports.setSaveLang = setSaveLang;
`,
	"helper": `\nlet solid_js_web = require("solid-js/web");
let helper_languages = require("helper/languages");
let solid_js = require("solid-js");
let solid_js_store = require("solid-js/store");
//#region src/helper/components.ts
const getDom = (id) => {
	let dom = document.getElementById(id);
	if (dom) {
		dom.innerHTML = "";
		return dom;
	}
	dom = document.createElement("div");
	dom.id = id;
	document.body.append(dom);
	return dom;
};
/** 挂载 solid-js 组件 */
const mountComponents = (id, fc) => {
	const dom = getDom(id);
	dom.style.setProperty("display", "unset", "important");
	const shadowDom = dom.attachShadow({ mode: "closed" });
	solid_js_web.render(fc, shadowDom);
	return dom;
};
//#endregion
//#region src/helper/faviconProgress.ts
var FaviconProgress = class {
	initLink;
	color;
	canvas;
	ctx;
	link;
	constructor(color = "#607D8B") {
		this.color = color;
		this.canvas = document.createElement("canvas");
		this.canvas.width = 32;
		this.canvas.height = 32;
		this.ctx = this.canvas.getContext("2d");
		const existingLink = document.querySelector("link[rel~='icon']");
		if (existingLink) this.link = existingLink;
		else {
			const link = document.createElement("link");
			link.type = "image/x-icon";
			link.rel = "icon";
			document.head.append(link);
			this.link = link;
		}
		this.initLink = this.link.href || "/favicon.ico";
	}
	update(progress) {
		this.ctx.clearRect(0, 0, 32, 32);
		this.ctx.beginPath();
		this.ctx.arc(16, 16, 16, 0, Math.PI * 2);
		this.ctx.fillStyle = "#FAFAFA";
		this.ctx.fill();
		const startAngle = -Math.PI / 2;
		const endAngle = Math.PI * 2 * progress + startAngle;
		this.ctx.beginPath();
		this.ctx.moveTo(16, 16);
		this.ctx.arc(16, 16, 16, startAngle, endAngle);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
		this.updateFavicon();
	}
	updateFavicon() {
		if (!this.link || !this.canvas) return;
		this.link.href = this.canvas.toDataURL("image/png");
	}
	/** 恢复默认图标 */
	recover() {
		if (!this.link || !this.initLink) return;
		this.link.href = this.initLink;
	}
};
const useFaviconProgress = () => {};
//#endregion
//#region locales/en.json
var en_default = {
	alert: {
		"comic_load_error": "Comic loading error",
		"download_failed": "Download failed",
		"fetch_comic_img_failed": "Failed to fetch comic images",
		"img_load_failed": "Image loading failed",
		"no_img_download": "No images available for download",
		"repeat_load": "Loading image, please wait",
		"retry_get_img_url": "Retrieve the URL of the image on page {{i}} again",
		"server_connect_failed": "Unable to connect to the server"
	},
	button: {
		"auto_scroll": "Auto scroll",
		"close_current_page_translation": "Close translation of the current page",
		"download_completed": "Download completed",
		"download_completed_error": "Download complete, but {{errorNum}} images failed to download",
		"downloading": "Downloading",
		"fullscreen": "Fullscreen",
		"fullscreen_exit": "Exit Fullscreen",
		"packaging": "Packaging",
		"page_fill": "Page fill",
		"page_mode_double": "Double page mode",
		"page_mode_single": "Single page mode",
		"scroll_mode": "Scroll mode",
		"translate_current_page": "Translate current page",
		"zoom_in": "Zoom in",
		"zoom_out": "Zoom out"
	},
	description: "Add enhanced features to the comic site for optimized experience, including dual-page reading and translation.",
	eh_tag_lint: {
		"combo": "[tag]: In most cases, Should coexist with [tag]",
		"conflict": "[tag]: Should not coexist with [tag]",
		"correct_tag": "Should be the correct tag",
		"miss_female": "Missing male tag, might need",
		"miss_parody": "Missing parody tag, might need",
		"possible_conflict": "[tag]: In most cases, Should not coexist with [tag]",
		"prerequisite": "[tag]: The prerequisite tag [tag] does not exist"
	},
	end_page: {
		"next_button": "Next chapter",
		"prev_button": "Prev chapter",
		"tip": {
			"end_jump": "Reached the last page, scrolling down will jump to the next chapter",
			"exit": "Reached the last page, scrolling down will exit",
			"start_jump": "Reached the first page, scrolling up will jump to the previous chapter"
		}
	},
	hotkeys: {
		"enter_read_mode": "Enter reading mode",
		"float_tag_list": "Floating tag list",
		"jump_next": "Jump to next chap",
		"jump_prev": "Jump to previous chap",
		"jump_to_end": "Jump to the last page",
		"jump_to_home": "Jump to the first page",
		"multi_select_load": "Multi-select load",
		"page_down": "Turn the page to the down",
		"page_up": "Turn the page to the up",
		"reload_current_error_img": "Reload current error image",
		"repeat_tip": "This hotkey has been bound to \\"{{hotkey}}\\"",
		"scroll_down": "Scroll down",
		"scroll_left": "Scroll left",
		"scroll_right": "Scroll right",
		"scroll_up": "Scroll up",
		"switch_auto_enlarge": "Switch auto image enlarge option",
		"switch_dir": "Switch reading direction",
		"switch_page_fill": "Switch page fill",
		"switch_scroll_mode": "Switch scroll mode",
		"switch_single_double_page_mode": "Switch single/double page mode"
	},
	img_status: {
		"error": "Load Error",
		"loading": "Loading",
		"wait": "Waiting for load"
	},
	other: {
		"auto": "Auto",
		"custom": "Custom",
		"disable": "Disable",
		"distance": "distance",
		"download": "Download",
		"enabled": "Enabled",
		"enter_comic_read_mode": "Enter comic reading mode",
		"exit": "Exit",
		"fab_hidden": "Hide floating button",
		"fab_show": "Show floating button",
		"fill_page": "Fill Page",
		"hotkeys": "Hotkeys",
		"img_loading": "Image loading",
		"interval": "interval",
		"loading_img": "Loading image",
		"multi_select_mode": "Multi-select mode",
		"none": "None",
		"or": "or",
		"other": "Other",
		"page_range": "Please enter the page range.:\\n (e.g., 1, 3-5, 9-)",
		"read_mode": "Reading mode",
		"selected": "Selected",
		"setting": "Settings",
		"clear": "Clear"
	},
	pwa: {
		"alert": {
			"img_data_error": "Image data error",
			"img_not_found": "Image not found",
			"img_not_found_files": "Please select an image file or a compressed file containing image files",
			"img_not_found_folder": "No image files or compressed files containing image files in the folder",
			"not_valid_url": "Not a valid URL",
			"parse_error": "Parsing error",
			"password_error": "Incorrect password",
			"repeat_load": "Loading other files…",
			"userscript_not_installed": "ComicRead userscript not installed"
		},
		"button": {
			"enter_url": "Enter URL",
			"install": "Install",
			"no_more_prompt": "Do not prompt again",
			"resume_read": "Restore reading",
			"select_files": "Select File",
			"select_folder": "Select folder"
		},
		"install_md": "### Tired of opening this webpage every time?\\nIf you wish to:\\n1. Have an independent window, as if using local software\\n1. Add to the local compressed file opening method for easy direct opening\\n1. Use offline\\n### Welcome to install this page as a PWA app on your computer😃👍",
		"message": {
			"enter_password": "Please enter your password",
			"parsing": "Parsing"
		},
		"tip_enter_url": "Please enter the URL of the compressed file",
		"tip_md": "# ComicRead PWA\\nRead **local** comics using [ComicRead](https://github.com/hymbz/ComicReadScript) reading mode.\\n---\\n### Drag and drop image files, folders, or compressed files directly to start reading\\n*You can also choose to **paste directly** or **enter** the URL of the compressed file for downloading and reading*"
	},
	setting: {
		"hotkeys": {
			"add": "Add new hotkeys",
			"restore": "Restore default hotkeys"
		},
		"language": "Language",
		"option": {
			"abreast_duplicate": "Column duplicates ratio",
			"abreast_mode": "Abreast scroll mode",
			"page_columns": "Pages per row",
			"adjust_to_width": "Adaptive Width",
			"align_edge": "Align to edge when turning page",
			"always_load_all_img": "Always load all images",
			"autoFullscreen": "Auto fullscreen",
			"autoHiddenMouse": "Auto hide mouse",
			"auto_scale": "Auto Scale",
			"auto_scroll_continuous": "Continuous scroll",
			"auto_scroll_trigger_end": "Continue scrolling on the end page",
			"auto_switch_page_mode": "Auto switch single/double page mode by aspect ratio",
			"background_color": "Background Color",
			"click_page_turn_area": "Touch area",
			"click_page_turn_enabled": "Click to turn page",
			"click_page_turn_swap_area": "Swap LR clickable areas",
			"dark_mode": "Dark mode",
			"dark_mode_auto": "Dark mode follow system",
			"dir_ltr": "LTR (American comics)",
			"dir_rtl": "RTL (Japanese manga)",
			"disable_auto_enlarge": "Disable automatic image enlarge",
			"first_page_fill": "Enable first page fill by default",
			"full_width": "Viewport Width",
			"img_filter": "Image filter",
			"img_filter_brightness": "Brightness",
			"img_filter_contrast": "Contrast",
			"img_filter_saturate": "Saturation",
			"img_recognition": "Image Recognition",
			"img_recognition_background": "Recognition background color",
			"img_recognition_pageFill": "Auto switch page fill",
			"img_recognition_crop": "Edge cropping",
			"img_recognition_keepMargin": "Keep margin",
			"img_recognition_warn": "❗ The current browser does not support Web Workers. Enabling this feature may cause page lag. It's recommended to upgrade or switch browsers.",
			"img_recognition_warn_2": "❗ The current website does not support Web Workers. Enabling this feature may cause page lag.",
			"paragraph_appearance": "Appearance",
			"paragraph_dir": "Reading direction",
			"paragraph_display": "Display",
			"paragraph_scrollbar": "Scrollbar",
			"paragraph_translation": "Translation",
			"preload_page_num": "Preload page number",
			"scroll_end": "After reaching the End",
			"scroll_end_auto": "First jump to previous/next chapter, else exit",
			"scroll_mode_img_scale": "Scroll mode image zoom ratio",
			"scroll_mode_img_spacing": "Scroll mode image spacing",
			"page_tip": "Page number tip",
			"page_tip_hide": "Hidden",
			"page_tip_auto": "Auto",
			"page_tip_always": "Always",
			"scrollbar_auto_hidden": "Auto hide",
			"scrollbar_easy_scroll": "Easy scroll",
			"scrollbar_position": "position",
			"scrollbar_position_bottom": "Bottom",
			"scrollbar_position_hidden": "Hidden",
			"scrollbar_position_right": "Right",
			"scrollbar_position_top": "Top",
			"scrollbar_show_img_status": "Show image loading status",
			"show_clickable_area": "Show clickable areas",
			"show_comments": "Show comments on the end page",
			"shrink_menu": "Enable menu area",
			"swap_page_turn_key": "Swap LR page-turning keys",
			"turn_page_animation_duration": "Page turn animation duration",
			"scroll_animation_duration": "Scroll animation duration",
			"zoom": "Image zoom ratio"
		},
		"sync_options_other_site": "Sync read options to other sites",
		"translation": {
			"cotrans_tip": "<p>Using the interface provided by <a href=\\"https://cotrans.touhou.ai\\" target=\\"_blank\\">Cotrans</a> to translate images, which is maintained by its maintainer at their own expense.</p>\\n<p>When multiple people use it at the same time, they need to queue and wait. If the waiting queue reaches its limit, uploading new images will result in an error. Please try again after a while.</p>\\n<p>So please <b>mind the frequency of use</b>.</p>\\n<p>It is highly recommended to locally deploy Manga Image Translator, as it does not consume server resources and does not require queuing.</p>",
			"options": {
				"box_threshold": "Box threshold",
				"detection_resolution": "Text detection resolution",
				"direction": "Render text orientation",
				"direction_auto": "Follow source",
				"direction_horizontal": "Horizontal only",
				"direction_vertical": "Vertical only",
				"force_retry": "Force retry (ignore cache)",
				"inpainter": "Inpainter",
				"inpainting_size": "Inpainting size",
				"local_url": "customize server URL",
				"mask_dilation_offset": "Mask dilation offset",
				"only_download_translated": "Download only the translated images",
				"target_language": "Target language",
				"text_detector": "Text detector",
				"translator": "Translator",
				"unclip_ratio": "Unclip ratio"
			},
			"range": "Scope of Translation",
			"provider": "Translator",
			"translate_all": "Translate all images",
			"translate_to_end": "Translate the current page to the end"
		}
	},
	site: {
		"add_feature": {
			"add_hotkeys_actions": "Add hotkeys actions",
			"auto_adjust_option": "Auto adjust reading option",
			"auto_page_turn": "Infinite scroll",
			"auto_show": "Auto enter reading mode",
			"block_totally": "Totally block comics",
			"colorize_tag": "Colorize tags",
			"cross_site_link": "Cross-site Link",
			"detect_ad": "Detect advertise page",
			"expand_tag_list": "Expand tag list",
			"float_tag_list": "Floating tag list",
			"load_original_image": "Load original image",
			"lock_option": "Lock site option",
			"open_link_new_page": "Open links in a new page",
			"quick_favorite": "Quick favorite",
			"quick_rating": "Quick rating",
			"quick_tag_define": "Quick view tag define",
			"remember_current_site": "Remember the current site",
			"tag_lint": "Tag Lint"
		},
		"changed_load_failed": "The website has undergone changes, unable to load comics",
		"ehentai": {
			"change_favorite_failed": "Failed to change the favorite",
			"change_favorite_success": "Successfully changed the favorite",
			"change_rating_failed": "Failed to change the rating",
			"change_rating_success": "Successfully changed the rating",
			"fetch_favorite_failed": "Failed to get favorite info",
			"fetch_img_page_source_failed": "Failed to get the source code of the image page",
			"fetch_img_page_url_failed": "Failed to get the image page address from the detail page",
			"fetch_img_url_failed": "Failed to get the image address from the image page",
			"hitomi_error": "hitomi matching error",
			"html_changed_link_failed": "The page structure has changed, and the associated external site features are not functioning properly",
			"ip_banned": "IP address is banned",
			"nhentai_error": "nhentai matching error",
			"nhentai_failed": "Matching failed, please refresh after confirming login to {{nhentai}}"
		},
		"nhentai": {
			"fetch_next_page_failed": "Failed to get next page of comic data",
			"tag_blacklist_fetch_failed": "Failed to fetch tag blacklist"
		},
		"show_settings_menu": "Show settings menu",
		"simple": {
			"auto_read_mode_message": "\\"Auto enter reading mode\\" is enabled by default",
			"no_img": "No suitable comic images were found.\\nIf necessary, you can click here to close the simple reading mode.",
			"simple_read_mode": "Enter simple reading mode"
		}
	},
	touch_area: {
		"menu": "Menu",
		"type": {
			"edge": "Edge",
			"l": "L",
			"left_right": "Left Right",
			"up_down": "Up Down"
		}
	},
	translation: {
		"status": {
			"after-translating": "Post-translation processing",
			"cancelled": "Translation cancelled",
			"colorizing": "Colorizing",
			"default": "Unknown status",
			"detection": "Detecting text",
			"downloading": "Downloading",
			"downscaling": "Downscaling",
			"error": "Error during translation",
			"error-download": "Download error",
			"error-lang": "The target language is not supported by the chosen translator",
			"error-translating": "Did not get any text back from the text translation service",
			"error-too-large": "Image size too large (greater than 8000x8000 px)",
			"error-upload": "Upload error",
			"error-disconnect": "Lost connection to server",
			"error-with-id": "Error during translation",
			"finished": "Finishing",
			"inpainting": "Inpainting",
			"mask-generation": "Generating mask",
			"ocr": "Scanning text",
			"pending": "Pending",
			"pending-pos": "Pending",
			"preparing": "Waiting for idle window",
			"rendering": "Rendering",
			"running_pre_translation_hooks": "Running pre-translation hooks",
			"saved": "Saved",
			"saving": "Saving",
			"skip-no-regions": "No text regions detected in the image",
			"skip-no-text": "No text detected in the image",
			"textline_merge": "Merging text lines",
			"translating": "Translating",
			"upload": "Uploading",
			"upscaling": "Upscaling",
			"uploading": "Uploading"
		},
		"tip": {
			"check_img_status_failed": "Failed to check image status",
			"download_img_failed": "Failed to download image",
			"get_translator_list_error": "Error occurred while getting the list of available translation services",
			"id_not_returned": "No id returned",
			"img_downloading": "Downloading images",
			"img_not_fully_loaded": "Image has not finished loading",
			"pending": "Pending, {{pos}} in queue",
			"resize_img_failed": "Failed to resize image",
			"translating": "Translating image",
			"translation_completed": "Translation completed",
			"upload": "Uploading image",
			"upload_error": "Image upload error",
			"upload_return_error": "Error during server translation",
			"wait_translation": "Waiting for translation"
		},
		"translator": {
			"baidu": "baidu",
			"deepl": "DeepL",
			"google": "Google",
			"gpt3.5": "GPT-3.5",
			"none": "Remove texts",
			"offline": "offline translator",
			"original": "Original",
			"papago": "Papago",
			"youdao": "youdao"
		}
	},
	upscale: {
		"module_download_complete": "Image Upscaling Model Download Complete",
		"module_download_failed": "Image Upscaling Model Download Failed",
		"module_downloading": "Image Upscaling Model Downloading...",
		"title": "Upscale Image",
		"upscaled": "upscaled",
		"upscaling": "upscaling",
		"webgpu_tip": "Unable to upscale images using WebGPU, processing will be slower"
	}
};
//#endregion
//#region locales/ru.json
var ru_default = {
	alert: {
		"comic_load_error": "Ошибка загрузки комикса",
		"download_failed": "Ошибка загрузки",
		"fetch_comic_img_failed": "Не удалось загрузить изображения",
		"img_load_failed": "Не удалось загрузить изображение",
		"no_img_download": "Нет доступных картинок для загрузки",
		"repeat_load": "Загрузка изображения, пожалуйста подождите",
		"retry_get_img_url": "Повторно получить адрес изображения на странице {{i}}",
		"server_connect_failed": "Не удалось подключиться к серверу"
	},
	button: {
		"auto_scroll": "Автопрокрутка",
		"close_current_page_translation": "Скрыть перевод текущей страницы",
		"download_completed": "Загрузка завершена",
		"download_completed_error": "Загрузка завершена, но {{errorNum}} изображений не удалось загрузить",
		"downloading": "Скачивание",
		"fullscreen": "полноэкранный",
		"fullscreen_exit": "выйти из полноэкранного режима",
		"packaging": "Упаковка",
		"page_fill": "Заполнить страницу",
		"page_mode_double": "Двухчастичный режим",
		"page_mode_single": "Одностраничный режим",
		"scroll_mode": "Режим прокрутки",
		"translate_current_page": "Перевести текущую страницу",
		"zoom_in": "Приблизить",
		"zoom_out": "Уменьшить"
	},
	description: "Добавляет расширенные функции для удобства на сайт, такие как двухстраничный режим и перевод.",
	eh_tag_lint: {
		"combo": "[тег]: В большинстве случаев должен сосуществовать с [тегом]",
		"conflict": "[tag]: Не должен сосуществовать с [tag]",
		"correct_tag": "Должен быть правильный тег",
		"miss_female": "Отсутствует мужской тег, возможно, понадобится",
		"miss_parody": "Отсутствует тег пародии, возможно, понадобится",
		"possible_conflict": "[tag]: В большинстве случаев не должен сосуществовать с [tag]",
		"prerequisite": "[tag]: Предварительный тег [tag] не существует"
	},
	end_page: {
		"next_button": "Следующая глава",
		"prev_button": "Предыдущая глава",
		"tip": {
			"end_jump": "Последняя страница, следующая глава ниже",
			"exit": "Последняя страница, ниже комикс будет закрыт",
			"start_jump": "Первая страница, выше будет загружена предыдущая глава"
		}
	},
	hotkeys: {
		"enter_read_mode": "Режим чтения",
		"float_tag_list": "Плавающий список тегов",
		"jump_next": "Перейти к следующей главе",
		"jump_prev": "Перейти к предыдущей главе",
		"jump_to_end": "Перейти к последней странице",
		"jump_to_home": "Перейти к первой странице",
		"multi_select_load": "Множественная загрузка",
		"page_down": "Перелистнуть страницу вниз",
		"page_up": "Перелистнуть страницу вверх",
		"reload_current_error_img": "Перезагрузить текущее ошибочное изображение",
		"repeat_tip": "Эта горячая клавиша была назначена на \\"{{hotkey}}\\"",
		"scroll_down": "Прокрутить вниз",
		"scroll_left": "Прокрутить влево",
		"scroll_right": "Прокрутите вправо",
		"scroll_up": "Прокрутите вверх",
		"switch_auto_enlarge": "Автоматическое приближение",
		"switch_dir": "Направление чтения",
		"switch_page_fill": "Заполнение страницы",
		"switch_scroll_mode": "Режим прокрутки",
		"switch_single_double_page_mode": "Одностраничный/Двухстраничный режим"
	},
	img_status: {
		"error": "Ошибка загрузки",
		"loading": "Загрузка",
		"wait": "Ожидание загрузки"
	},
	other: {
		"auto": "Авто",
		"custom": "Custom",
		"disable": "Отключить",
		"distance": "расстояние",
		"download": "Скачать",
		"enabled": "Включено",
		"enter_comic_read_mode": "Режим чтения комиксов",
		"exit": "Выход",
		"fab_hidden": "Скрыть плавающую кнопку",
		"fab_show": "Показать плавающую кнопку",
		"fill_page": "Заполнить страницу",
		"hotkeys": "Горячие клавиши",
		"img_loading": "Изображение загружается",
		"interval": "интервал",
		"loading_img": "Загрузка изображения",
		"multi_select_mode": "Режим множественного выбора",
		"none": "Отсутствует",
		"or": "или",
		"other": "Другое",
		"page_range": "Введите диапазон страниц.:\\n (например, 1, 3-5, 9-)",
		"read_mode": "Режим чтения",
		"selected": "Выбрано",
		"setting": "Настройки",
		"clear": "Очистить"
	},
	pwa: {
		"alert": {
			"img_data_error": "Ошибка данных изображения",
			"img_not_found": "Изображение не найдено",
			"img_not_found_files": "Пожалуйста выберите файл или архив с изображениями",
			"img_not_found_folder": "В папке не найдены изображения или архивы с изображениями",
			"not_valid_url": "Невалидный URL",
			"parse_error": "Ошибка анализа",
			"password_error": "Неверный пароль",
			"repeat_load": "Загрузка других файлов…",
			"userscript_not_installed": "ComicRead не установлен"
		},
		"button": {
			"enter_url": "Ввести URL",
			"install": "Установить",
			"no_more_prompt": "Больше не показывать",
			"resume_read": "Продолжить чтение",
			"select_files": "Выбрать файл",
			"select_folder": "Выбрать папку"
		},
		"install_md": "### Устали открывать эту страницу каждый раз?\\nЕсли вы хотите:\\n1. Иметь отдельное окно, как если бы вы использовали обычное программное обеспечение\\n1. Открывать архивы напрямую\\n1. Пользоваться оффлайн\\n### Установите эту страницу в качестве [PWA](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D0%B2%D0%BD%D0%BE%D0%B5_%D0%B2%D0%B5%D0%B1-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5) на свой компьютер 🐺☝️",
		"message": {
			"enter_password": "Пожалуйста введите пароль",
			"parsing": "Разбор"
		},
		"tip_enter_url": "Введите URL архива",
		"tip_md": "# ComicRead PWA\\nИспользуйте [ComicRead](https://github.com/hymbz/ComicReadScript) для чтения комиксов **локально**.\\n---\\n### Перетащите изображения, папки или архивы чтобы начать читать\\n*Вы так же можете **открыть** или **вставить** URL архива на напрямую*"
	},
	setting: {
		"hotkeys": {
			"add": "Добавить горячие клавиши",
			"restore": "Восстановить горячие клавиши по умолчанию"
		},
		"language": "Язык",
		"option": {
			"abreast_duplicate": "Коэффициент дублирования столбцов",
			"abreast_mode": "Режим прокрутки в ряд",
			"page_columns": "Страниц в строке",
			"adjust_to_width": "Адаптивная ширина",
			"align_edge": "Выравнивание по краю при перелистывании страницы",
			"always_load_all_img": "Всегда загружать все изображения",
			"autoFullscreen": "Авто полный экран",
			"autoHiddenMouse": "Автоматически скрывать курсор мыши",
			"auto_scale": "Авто масштаб",
			"auto_scroll_continuous": "Непрерывная прокрутка",
			"auto_scroll_trigger_end": "Продолжить прокрутку на конечной странице",
			"auto_switch_page_mode": "Автоматическое переключение режима одной/двойной страницы в зависимости от соотношения сторон",
			"background_color": "Цвет фона",
			"click_page_turn_area": "Область нажатия",
			"click_page_turn_enabled": "Перелистывать по клику",
			"click_page_turn_swap_area": "Поменять местами правую и левую области переключения страниц",
			"dark_mode": "Тёмная тема",
			"dark_mode_auto": "Тёмный режим следует за системой",
			"dir_ltr": "Чтение слева направо (Американские комиксы)",
			"dir_rtl": "Чтение справа налево (Японская манга)",
			"disable_auto_enlarge": "Отключить автоматическое масштабирование изображений",
			"first_page_fill": "Включить заполнение первой страницы по умолчанию",
			"full_width": "Ширина окна просмотра",
			"img_filter": "Фильтр изображения",
			"img_filter_brightness": "Яркость",
			"img_filter_contrast": "Контраст",
			"img_filter_saturate": "Насыщенность",
			"img_recognition": "распознавание изображений",
			"img_recognition_background": "Определить цвет фона",
			"img_recognition_pageFill": "Автоматическое переключение заполнения страницы",
			"img_recognition_crop": "Обрезка краёв",
			"img_recognition_keepMargin": "Оставить поля",
			"img_recognition_warn": "❗ Текущий браузер не поддерживает Web Workers. Включение этой функции может вызвать задержку страницы. Рекомендуется обновить или сменить браузер.",
			"img_recognition_warn_2": "❗ Текущий веб-сайт не поддерживает Web Workers. Включение этой функции может привести к задержке страницы.",
			"paragraph_appearance": "Внешность",
			"paragraph_dir": "Направление чтения",
			"paragraph_display": "Отображение",
			"paragraph_scrollbar": "Полоса прокрутки",
			"paragraph_translation": "Перевод",
			"preload_page_num": "Предзагружать страниц",
			"scroll_end": "После достижения конца",
			"scroll_end_auto": "Сначала переход к предыдущей/следующей главе, иначе выход",
			"scroll_mode_img_scale": "Коэффициент масштабирования изображения в режиме скроллинга",
			"scroll_mode_img_spacing": "Расстояние между страницами в режиме скроллинга",
			"page_tip": "Подсказка номера страницы",
			"page_tip_hide": "Скрыть",
			"page_tip_auto": "Авто",
			"page_tip_always": "Всегда",
			"scrollbar_auto_hidden": "Автоматически скрывать",
			"scrollbar_easy_scroll": "Лёгкая прокрутка",
			"scrollbar_position": "Позиция",
			"scrollbar_position_bottom": "Снизу",
			"scrollbar_position_hidden": "Спрятано",
			"scrollbar_position_right": "Справа",
			"scrollbar_position_top": "Сверху",
			"scrollbar_show_img_status": "Показывать статус загрузки изображения",
			"show_clickable_area": "Показывать кликабельные области",
			"show_comments": "Показывать комментарии на последней странице",
			"shrink_menu": "Включить область меню",
			"swap_page_turn_key": "Поменять местами клавиши переключения страниц",
			"turn_page_animation_duration": "Длительность анимации перелистывания",
			"scroll_animation_duration": "Длительность анимации прокрутки",
			"zoom": "Коэффициент масштабирования изображения"
		},
		"sync_options_other_site": "Синхронизировать настройки чтения с другими сайтами",
		"translation": {
			"cotrans_tip": "<p>Использует для перевода <a href=\\"https://cotrans.touhou.ai\\" target=\\"_blank\\">Cotrans API</a>, работающий исключительно за счёт своего создателя.</p>\\n<p>Запросы обрабатываются по одному в порядке синхронной очереди. Когда очередь превышает лимит новые запросы будут приводить к ошибке. Если такое случилось попробуйте позже.</p>\\n<p>Так что пожалуйста <b>учитывайте загруженность при выборе</b></p>\\n<p>Настоятельно рекомендовано локально развернуть Manga Image Translator т.к. это не потребляет серверные ресурсы и вы не ограничены очередью.</p>",
			"options": {
				"box_threshold": "Порог коробки",
				"detection_resolution": "Разрешение распознавания текста",
				"direction": "Ориетнация текста",
				"direction_auto": "Следование оригиналу",
				"direction_horizontal": "Только горизонтально",
				"direction_vertical": "Только вертикально",
				"force_retry": "Принудительный повтор(Игнорировать кэш)",
				"inpainter": "Инпейнтер",
				"inpainting_size": "Инпейнтинг размер области",
				"local_url": "Настроить URL сервера",
				"mask_dilation_offset": "Маскировочное смещение дилатации",
				"only_download_translated": "Скачать только переведённые изображения",
				"target_language": "Целевой язык",
				"text_detector": "Детектор текста",
				"translator": "Переводчик",
				"unclip_ratio": "Необрезанное соотношение"
			},
			"range": "Объем перевода",
			"provider": "Переводчик",
			"translate_all": "Перевести все изображения",
			"translate_to_end": "Переводить страницу до конца"
		}
	},
	site: {
		"add_feature": {
			"add_hotkeys_actions": "Добавить операции с горячими клавишами",
			"auto_adjust_option": "Автоматическая настройка параметра чтения",
			"auto_page_turn": "Бесконечная прокрутка",
			"auto_show": "Автоматически включать режим чтения",
			"block_totally": "Глобально заблокировать комиксы",
			"colorize_tag": "Цветные названия",
			"cross_site_link": "Кросс-сайтовая ссылка",
			"detect_ad": "Detect advertise page",
			"expand_tag_list": "Развернуть список тегов",
			"float_tag_list": "Плавающий список тегов",
			"load_original_image": "Загружать оригинальное изображение",
			"lock_option": "Блокировка опции сайта",
			"open_link_new_page": "Открывать ссылки в новой вкладке",
			"quick_favorite": "Быстрый фаворит",
			"quick_rating": "Быстрый рейтинг",
			"quick_tag_define": "Определение тега быстрого просмотра",
			"remember_current_site": "Запомнить текущий сайт",
			"tag_lint": "Тэг Линт"
		},
		"changed_load_failed": "Страница изменилась, невозможно загрузить комикс",
		"ehentai": {
			"change_favorite_failed": "Не удалось изменить избранное",
			"change_favorite_success": "Избранное успешно изменено",
			"change_rating_failed": "Не удалось изменить оценку",
			"change_rating_success": "Успешно изменен рейтинг",
			"fetch_favorite_failed": "Не удалось получить информацию о избранном",
			"fetch_img_page_source_failed": "Не удалось получить исходный код страницы с изображениями",
			"fetch_img_page_url_failed": "Не удалось получить адрес страницы изображений из деталей",
			"fetch_img_url_failed": "Не удалось получить адрес изображения",
			"hitomi_error": "Ошибка сопоставления hitomi",
			"html_changed_link_failed": "Структура страницы изменилась, и связанные функции внешнего сайта не работают должным образом",
			"ip_banned": "IP адрес забанен",
			"nhentai_error": "Ошибка сопоставления nhentai",
			"nhentai_failed": "Ошибка сопостовления. Пожалуйста перезагрузите страницу после входа на {{nhentai}}"
		},
		"nhentai": {
			"fetch_next_page_failed": "Не удалось получить следующую страницу",
			"tag_blacklist_fetch_failed": "Не удалось получить заблокированные теги"
		},
		"show_settings_menu": "Показать меню настроек",
		"simple": {
			"auto_read_mode_message": "\\"Автоматически включать режим чтения\\" по умолчанию",
			"no_img": "Не найдено подходящих изображений. Нажмите тут что бы выключить режим простого чтения.",
			"simple_read_mode": "Включить простой режим чтения"
		}
	},
	touch_area: {
		"menu": "Меню",
		"type": {
			"edge": "Грань",
			"l": "L",
			"left_right": "Лево Право",
			"up_down": "Верх Низ"
		}
	},
	translation: {
		"status": {
			"after-translating": "Постобработка перевода",
			"cancelled": "Перевод отменён",
			"colorizing": "Раскрашивание",
			"default": "Неизвестный статус",
			"detection": "Распознавание текста",
			"downloading": "Загрузка",
			"downscaling": "Уменьшение масштаба",
			"error": "Ошибка перевода",
			"error-download": "Ошибка загрузки",
			"error-lang": "Целевой язык не поддерживается выбранным переводчиком",
			"error-translating": "Ошибка перевода(пустой ответ)",
			"error-too-large": "Размер изображения слишком большой (более 8000x8000 пикселей)",
			"error-upload": "Ошибка отправки",
			"error-disconnect": "Потеряно соединение с сервером",
			"error-with-id": "Ошибка во время перевода",
			"finished": "Завершение",
			"inpainting": "Наложение",
			"mask-generation": "Генерация маски",
			"ocr": "Распознавание текста",
			"pending": "Ожидание",
			"pending-pos": "Ожидание",
			"preparing": "Ожидание окна бездействия",
			"rendering": "Отрисовка",
			"running_pre_translation_hooks": "Выполнение предобработки перевода",
			"saved": "Сохранено",
			"saving": "Сохранение",
			"skip-no-regions": "На изображении не обнаружено текстовых областей.",
			"skip-no-text": "Текст на изображении не обнаружен",
			"textline_merge": "Обьединение текста",
			"translating": "Переводится",
			"upload": "Отправка",
			"upscaling": "Увеличение изображения",
			"uploading": "Отправка"
		},
		"tip": {
			"check_img_status_failed": "Не удалось проверить статус изображения",
			"download_img_failed": "Не удалось скачать изображение",
			"get_translator_list_error": "Произошла ошибка во время получения списка доступных переводчиков",
			"id_not_returned": "ID не вернули(",
			"img_downloading": "Скачать",
			"img_not_fully_loaded": "Изображение всё ещё загружается",
			"pending": "Ожидение, позиция в очереди {{pos}}",
			"resize_img_failed": "Не удалось изменить размер изображения",
			"translating": "Изображение переводится",
			"translation_completed": "Перевод завершён",
			"upload": "Загрузка изображения",
			"upload_error": "Ошибка отправки изображения",
			"upload_return_error": "Ошибка перевода на сервере",
			"wait_translation": "Ожидание перевода"
		},
		"translator": {
			"baidu": "baidu",
			"deepl": "DeepL",
			"google": "Google",
			"gpt3.5": "GPT-3.5",
			"none": "Убрать текст",
			"offline": "Оффлайн переводчик",
			"original": "Оригинал",
			"papago": "Papago",
			"youdao": "youdao"
		}
	},
	upscale: {
		"module_download_complete": "Загрузка модели увеличения изображений завершена",
		"module_download_failed": "Сбой загрузки модели увеличения изображений",
		"module_downloading": "Загрузка модели увеличения изображений...",
		"title": "Увеличение изображения",
		"upscaled": "Увеличенный",
		"upscaling": "Увеличивается",
		"webgpu_tip": "Невозможно увеличить изображения с помощью WebGPU, обработка будет медленнее"
	}
};
//#endregion
//#region locales/zh.json
var zh_default = {
	alert: {
		"comic_load_error": "漫画加载出错",
		"download_failed": "下载失败",
		"fetch_comic_img_failed": "获取漫画图片失败",
		"img_load_failed": "图片加载失败",
		"no_img_download": "没有能下载的图片",
		"repeat_load": "加载图片中，请稍候",
		"retry_get_img_url": "重新获取第 {{i}} 页图片的地址",
		"server_connect_failed": "无法连接到服务器"
	},
	button: {
		"auto_scroll": "自动滚动",
		"close_current_page_translation": "关闭当前页的翻译",
		"download_completed": "下载完成",
		"download_completed_error": "下载完成，但有 {{errorNum}} 张图片下载失败",
		"downloading": "下载中",
		"fullscreen": "全屏",
		"fullscreen_exit": "退出全屏",
		"packaging": "打包中",
		"page_fill": "页面填充",
		"page_mode_double": "双页模式",
		"page_mode_single": "单页模式",
		"scroll_mode": "卷轴模式",
		"translate_current_page": "翻译当前页",
		"zoom_in": "放大",
		"zoom_out": "缩小"
	},
	description: "为漫画站增加双页阅读、翻译等优化体验的增强功能。",
	eh_tag_lint: {
		"combo": "存在 [tag] 时，一般也存在 [tag]",
		"conflict": "存在 [tag] 时，不应该存在 [tag]",
		"correct_tag": "应该是正确的标签",
		"miss_female": "缺少男性标签，可能需要",
		"miss_parody": "缺少原作标签，可能需要",
		"possible_conflict": "存在 [tag] 时，一般不应该存在 [tag]",
		"prerequisite": "[tag] 的前置标签 [tag] 不存在"
	},
	end_page: {
		"next_button": "下一话",
		"prev_button": "上一话",
		"tip": {
			"end_jump": "已到结尾，继续向下翻页将跳至下一话",
			"exit": "已到结尾，继续翻页将退出",
			"start_jump": "已到开头，继续向上翻页将跳至上一话"
		}
	},
	hotkeys: {
		"enter_read_mode": "进入阅读模式",
		"float_tag_list": "悬浮标签列表",
		"jump_next": "跳至下一话",
		"jump_prev": "跳至上一话",
		"jump_to_end": "跳至尾页",
		"jump_to_home": "跳至首页",
		"multi_select_load": "多选加载",
		"page_down": "向下翻页",
		"page_up": "向上翻页",
		"reload_current_error_img": "重载当前错误图片",
		"repeat_tip": "此快捷键已被绑定至「{{hotkey}}」",
		"scroll_down": "向下滚动",
		"scroll_left": "向左滚动",
		"scroll_right": "向右滚动",
		"scroll_up": "向上滚动",
		"switch_auto_enlarge": "切换图片自动放大选项",
		"switch_dir": "切换阅读方向",
		"switch_page_fill": "切换页面填充",
		"switch_scroll_mode": "切换卷轴模式",
		"switch_single_double_page_mode": "切换单双页模式"
	},
	img_status: {
		"error": "加载出错",
		"loading": "正在加载",
		"wait": "等待加载"
	},
	other: {
		"auto": "自动",
		"custom": "自定义",
		"disable": "禁用",
		"distance": "距离",
		"download": "下载",
		"enabled": "启用",
		"enter_comic_read_mode": "进入漫画阅读模式",
		"exit": "退出",
		"fab_hidden": "隐藏悬浮按钮",
		"fab_show": "显示悬浮按钮",
		"fill_page": "填充页",
		"hotkeys": "快捷键",
		"img_loading": "图片加载中",
		"interval": "间隔",
		"loading_img": "加载图片中",
		"multi_select_mode": "多选模式",
		"none": "无",
		"or": "或",
		"other": "其他",
		"page_range": "请输入页码范围：\\n（例如：1, 3-5, 9-)",
		"read_mode": "阅读模式",
		"selected": "已选中",
		"setting": "设置",
		"clear": "清空"
	},
	pwa: {
		"alert": {
			"img_data_error": "图片数据错误",
			"img_not_found": "找不到图片",
			"img_not_found_files": "请选择图片文件或含有图片文件的压缩包",
			"img_not_found_folder": "文件夹下没有图片文件或含有图片文件的压缩包",
			"not_valid_url": "不是有效的 URL",
			"parse_error": "解析出错",
			"password_error": "密码错误",
			"repeat_load": "正在加载其他文件中……",
			"userscript_not_installed": "未安装 ComicRead 脚本"
		},
		"button": {
			"enter_url": "输入 URL",
			"install": "安装",
			"no_more_prompt": "不再提示",
			"resume_read": "恢复阅读",
			"select_files": "选择文件",
			"select_folder": "选择文件夹"
		},
		"install_md": "### 每次都要打开这个网页很麻烦？\\n如果你希望\\n1. 能有独立的窗口，像是在使用本地软件一样\\n1. 加入本地压缩文件的打开方式之中，方便直接打开\\n1. 离线使用~~（主要是担心国内网络抽风无法访问这个网页~~\\n### 欢迎将本页面作为 PWA 应用安装到电脑上😃👍",
		"message": {
			"enter_password": "请输入密码",
			"parsing": "解析中"
		},
		"tip_enter_url": "请输入压缩包 URL",
		"tip_md": "# ComicRead PWA\\n使用 [ComicRead](https://github.com/hymbz/ComicReadScript) 的阅读模式阅读**本地**漫画\\n---\\n### 将图片文件、文件夹、压缩包直接拖入即可开始阅读\\n*也可以选择**直接粘贴**或**输入**压缩包 URL 下载阅读*"
	},
	setting: {
		"hotkeys": {
			"add": "添加新快捷键",
			"restore": "恢复默认快捷键"
		},
		"language": "语言",
		"option": {
			"abreast_duplicate": "每列重复比例",
			"abreast_mode": "并排卷轴模式",
			"page_columns": "每行并排页数",
			"adjust_to_width": "自适应宽度",
			"align_edge": "滚动翻页时对齐边缘",
			"always_load_all_img": "始终加载所有图片",
			"autoFullscreen": "自动全屏",
			"autoHiddenMouse": "自动隐藏鼠标",
			"auto_scale": "自动缩放",
			"auto_scroll_continuous": "持续滚动",
			"auto_scroll_trigger_end": "在结束页上继续滚动",
			"auto_switch_page_mode": "按屏幕比例切换单双页",
			"background_color": "背景颜色",
			"click_page_turn_area": "点击区域",
			"click_page_turn_enabled": "点击翻页",
			"click_page_turn_swap_area": "左右点击区域交换",
			"dark_mode": "黑暗模式",
			"dark_mode_auto": "黑暗模式跟随系统",
			"dir_ltr": "从左到右（美漫）",
			"dir_rtl": "从右到左（日漫）",
			"disable_auto_enlarge": "禁止图片自动放大",
			"first_page_fill": "默认启用首页填充",
			"full_width": "视窗宽度",
			"img_filter": "图片滤镜",
			"img_filter_brightness": "亮度",
			"img_filter_contrast": "对比度",
			"img_filter_saturate": "饱和度",
			"img_recognition": "图像识别",
			"img_recognition_background": "识别背景色",
			"img_recognition_pageFill": "自动调整页面填充",
			"img_recognition_crop": "边缘裁切",
			"img_recognition_keepMargin": "保留白边",
			"img_recognition_warn": "❗ 当前浏览器不支持 Web Worker，开启此功能可能导致页面卡顿，建议升级或更换浏览器。",
			"img_recognition_warn_2": "❗ 当前网站不支持 Web Worker，开启此功能可能导致页面卡顿。",
			"paragraph_appearance": "外观",
			"paragraph_dir": "阅读方向",
			"paragraph_display": "显示",
			"paragraph_scrollbar": "滚动条",
			"paragraph_translation": "翻译",
			"preload_page_num": "预加载页数",
			"scroll_end": "翻页至尽头后",
			"scroll_end_auto": "优先跳至上/下一话，否则退出",
			"scroll_mode_img_scale": "卷轴图片缩放",
			"scroll_mode_img_spacing": "卷轴图片间距",
			"page_tip": "页数提示",
			"page_tip_hide": "隐藏",
			"page_tip_auto": "自动",
			"page_tip_always": "常驻",
			"scrollbar_auto_hidden": "自动隐藏",
			"scrollbar_easy_scroll": "快捷滚动",
			"scrollbar_position": "位置",
			"scrollbar_position_bottom": "底部",
			"scrollbar_position_hidden": "隐藏",
			"scrollbar_position_right": "右侧",
			"scrollbar_position_top": "顶部",
			"scrollbar_show_img_status": "显示图片加载状态",
			"show_clickable_area": "显示点击区域",
			"show_comments": "在结束页显示评论",
			"shrink_menu": "缩小菜单区域",
			"swap_page_turn_key": "左右翻页键交换",
			"turn_page_animation_duration": "翻页动画时长",
			"scroll_animation_duration": "滚动动画时长",
			"zoom": "图片缩放"
		},
		"sync_options_other_site": "同步阅读配置至其他站点",
		"translation": {
			"cotrans_tip": "<p>将使用 <a href=\\"https://cotrans.touhou.ai\\" target=\\"_blank\\">Cotrans</a> 提供的接口翻译图片，该服务器由其维护者用爱发电自费维护</p>\\n<p>多人同时使用时需要排队等待，等待队列达到上限后再上传新图片会报错，需要过段时间再试</p>\\n<p>所以还请 <b>注意用量</b></p>\\n<p>更推荐自己本地部署 Manga Image Translator，既不占用服务器资源也不需要排队</p>",
			"options": {
				"box_threshold": "文本框阈值",
				"detection_resolution": "文本扫描清晰度",
				"direction": "渲染字体方向",
				"direction_auto": "原文一致",
				"direction_horizontal": "仅限水平",
				"direction_vertical": "仅限垂直",
				"force_retry": "忽略缓存强制重试",
				"inpainter": "图像修复器",
				"inpainting_size": "图像修复尺寸",
				"local_url": "自定义服务器 URL",
				"mask_dilation_offset": "掩码膨胀偏移量",
				"only_download_translated": "只下载翻译完的图片",
				"target_language": "目标语言",
				"text_detector": "文本扫描器",
				"translator": "翻译服务",
				"unclip_ratio": "文本框膨胀比率"
			},
			"range": "翻译范围",
			"provider": "翻译器",
			"translate_all": "翻译全部图片",
			"translate_to_end": "翻译当前页至结尾"
		}
	},
	site: {
		"add_feature": {
			"add_hotkeys_actions": "增加快捷键操作",
			"auto_adjust_option": "自动调整阅读配置",
			"auto_page_turn": "无限滚动",
			"auto_show": "自动进入阅读模式",
			"block_totally": "彻底屏蔽漫画",
			"colorize_tag": "标签染色",
			"cross_site_link": "关联外站",
			"detect_ad": "识别广告页",
			"expand_tag_list": "展开标签列表",
			"float_tag_list": "悬浮标签列表",
			"load_original_image": "加载原图",
			"lock_option": "锁定站点配置",
			"open_link_new_page": "在新页面中打开链接",
			"quick_favorite": "快捷收藏",
			"quick_rating": "快捷评分",
			"quick_tag_define": "快捷查看标签定义",
			"remember_current_site": "记住当前站点",
			"tag_lint": "标签检查"
		},
		"changed_load_failed": "网站发生变化，无法加载漫画",
		"ehentai": {
			"change_favorite_failed": "收藏夹修改失败",
			"change_favorite_success": "收藏夹修改成功",
			"change_rating_failed": "评分修改失败",
			"change_rating_success": "评分修改成功",
			"fetch_favorite_failed": "获取收藏夹信息失败",
			"fetch_img_page_source_failed": "获取图片页源码失败",
			"fetch_img_page_url_failed": "从详情页获取图片页地址失败",
			"fetch_img_url_failed": "从图片页获取图片地址失败",
			"hitomi_error": "hitomi 匹配出错",
			"html_changed_link_failed": "页面结构发生改变，关联外站功能无法正常生效",
			"ip_banned": "IP地址被禁",
			"nhentai_error": "nhentai 匹配出错",
			"nhentai_failed": "匹配失败，请在确认登录 {{nhentai}} 后刷新"
		},
		"nhentai": {
			"fetch_next_page_failed": "获取下一页漫画数据失败",
			"tag_blacklist_fetch_failed": "标签黑名单获取失败"
		},
		"show_settings_menu": "显示设置菜单",
		"simple": {
			"auto_read_mode_message": "已默认开启「自动进入阅读模式」",
			"no_img": "未找到合适的漫画图片，\\n如有需要可点此关闭简易阅读模式",
			"simple_read_mode": "使用简易阅读模式"
		}
	},
	touch_area: {
		"menu": "菜单",
		"type": {
			"edge": "边缘",
			"l": "L",
			"left_right": "左右",
			"up_down": "上下"
		}
	},
	translation: {
		"status": {
			"after-translating": "翻译后处理中",
			"cancelled": "翻译已取消",
			"colorizing": "正在上色",
			"default": "未知状态",
			"detection": "正在检测文本",
			"downloading": "正在下载",
			"downscaling": "正在缩小图片",
			"error": "翻译出错",
			"error-download": "下载出错",
			"error-lang": "你选择的翻译服务不支持你选择的语言",
			"error-translating": "翻译服务没有返回任何文本",
			"error-too-large": "图片尺寸过大（超过 8000x8000 像素）",
			"error-upload": "上传出错",
			"error-disconnect": "与服务器断开连接",
			"error-with-id": "翻译出错",
			"finished": "正在整理结果",
			"inpainting": "正在修补图片",
			"mask-generation": "正在生成文本掩码",
			"ocr": "正在识别文本",
			"pending": "正在等待",
			"pending-pos": "正在等待",
			"preparing": "等待空闲窗口",
			"rendering": "正在渲染",
			"running_pre_translation_hooks": "正在执行翻译前处理",
			"saved": "保存结果",
			"saving": "正在保存",
			"skip-no-regions": "图片中没有检测到文本区域",
			"skip-no-text": "图片中没有检测到文本",
			"textline_merge": "正在整合文本",
			"translating": "正在翻译文本",
			"upload": "正在上传",
			"upscaling": "正在放大图片",
			"uploading": "正在上传"
		},
		"tip": {
			"check_img_status_failed": "检查图片状态失败",
			"download_img_failed": "下载图片失败",
			"get_translator_list_error": "获取可用翻译服务列表时出错",
			"id_not_returned": "未返回 id",
			"img_downloading": "下载图片中",
			"img_not_fully_loaded": "图片未加载完毕",
			"pending": "正在等待，列队还有 {{pos}} 张图片",
			"resize_img_failed": "缩放图片失败",
			"translating": "翻译图片中",
			"translation_completed": "翻译完成",
			"upload": "上传图片中",
			"upload_error": "上传图片出错",
			"upload_return_error": "服务器翻译出错",
			"wait_translation": "等待翻译"
		},
		"translator": {
			"baidu": "百度",
			"deepl": "DeepL",
			"google": "谷歌",
			"gpt3.5": "GPT-3.5",
			"none": "删除文本",
			"offline": "离线模型",
			"original": "原文",
			"papago": "Papago",
			"youdao": "有道"
		}
	},
	upscale: {
		"module_download_complete": "图片放大模型下载完成",
		"module_download_failed": "图片放大模型下载失败",
		"module_downloading": "图片放大模型下载中...",
		"title": "无损放大图片",
		"upscaled": "已放大",
		"upscaling": "放大中",
		"webgpu_tip": "无法使用 WebGPU 放大图片，处理速度将变慢"
	}
};
//#endregion
//#region node_modules/.pnpm/@solid-primitives+scheduled@1.5.3_solid-js@1.9.14/node_modules/@solid-primitives/scheduled/dist/index.js
/**
* Creates a callback that is debounced and cancellable. The debounced callback is called on **trailing** edge.
*
* The timeout will be automatically cleared on root dispose.
*
* @param callback The callback to debounce
* @param wait The duration to debounce in milliseconds
* @returns The debounced function
*
* @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/scheduled#debounce
*
* @example
* \`\`\`ts
* const fn = debounce((message: string) => console.log(message), 250);
* fn('Hello!');
* fn.clear() // clears a timeout in progress
* \`\`\`
*/
const debounce$1 = (callback, wait) => {
	if (solid_js_web.isServer) return Object.assign(() => void 0, { clear: () => void 0 });
	let timeoutId;
	const clear = () => clearTimeout(timeoutId);
	if (solid_js.getOwner()) solid_js.onCleanup(clear);
	const debounced = (...args) => {
		if (timeoutId !== void 0) clear();
		timeoutId = setTimeout(() => callback(...args), wait);
	};
	return Object.assign(debounced, { clear });
};
/**
* Creates a callback that is throttled and cancellable. The throttled callback is called on **trailing** edge.
*
* The timeout will be automatically cleared on root dispose.
*
* @param callback The callback to throttle
* @param wait The duration to throttle
* @returns The throttled callback trigger
*
* @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/scheduled#throttle
*
* @example
* \`\`\`ts
* const trigger = throttle((val: string) => console.log(val), 250);
* trigger('my-new-value');
* trigger.clear() // clears a timeout in progress
* \`\`\`
*/
const throttle$1 = (callback, wait) => {
	if (solid_js_web.isServer) return Object.assign(() => void 0, { clear: () => void 0 });
	let isThrottled = false, timeoutId, lastArgs;
	const throttled = (...args) => {
		lastArgs = args;
		if (isThrottled) return;
		isThrottled = true;
		timeoutId = setTimeout(() => {
			callback(...lastArgs);
			isThrottled = false;
		}, wait);
	};
	const clear = () => {
		clearTimeout(timeoutId);
		isThrottled = false;
	};
	if (solid_js.getOwner()) solid_js.onCleanup(clear);
	return Object.assign(throttled, { clear });
};
/**
* Creates a scheduled and cancellable callback that will be called on the **leading** edge for the first call, and **trailing** edge for other calls.
*
* The timeout will be automatically cleared on root dispose.
*
* @param schedule {@link debounce} or {@link throttle}
* @param callback The callback to debounce/throttle
* @param wait timeout duration
* @returns The scheduled callback trigger
*
* @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/scheduled#leadingAndTrailing
*
* @example
* \`\`\`ts
* const trigger = leadingAndTrailing(throttle, (val: string) => console.log(val), 250);
* trigger('my-new-value');
* trigger.clear() // clears a timeout in progress
* \`\`\`
*/
function leadingAndTrailing(schedule, callback, wait) {
	if (solid_js_web.isServer) {
		let called = false;
		const scheduled = (...args) => {
			if (called) return;
			called = true;
			callback(...args);
		};
		return Object.assign(scheduled, { clear: () => void 0 });
	}
	let State;
	(function(State) {
		State[State["Ready"] = 0] = "Ready";
		State[State["Leading"] = 1] = "Leading";
		State[State["Trailing"] = 2] = "Trailing";
	})(State || (State = {}));
	let state = State.Ready;
	const scheduled = schedule((args) => {
		state === State.Trailing && callback(...args);
		state = State.Ready;
	}, wait);
	const fn = (...args) => {
		if (state !== State.Trailing) {
			if (state === State.Ready) callback(...args);
			state += 1;
		}
		scheduled(args);
	};
	const clear = () => {
		state = State.Ready;
		scheduled.clear();
	};
	if (solid_js.getOwner()) solid_js.onCleanup(clear);
	return Object.assign(fn, { clear });
}
/**
* Creates a signal used for scheduling execution of solid computations by tracking.
*
* @param schedule Schedule the invalidate function (can be {@link debounce} or {@link throttle})
* @returns A function used to track the signal. It returns \`true\` if the signal is dirty *(callback should be called)* and \`false\` otherwise.
*
* @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/scheduled#createScheduled
*
* @example
* \`\`\`ts
* const debounced = createScheduled(fn => debounce(fn, 250));
*
* createEffect(() => {
*   // track source signal
*   const value = count();
*   // track the debounced signal and check if it's dirty
*   if (debounced()) {
*     console.log('count', value);
*   }
* });
* \`\`\`
*/
function createScheduled(schedule) {
	let listeners = 0;
	let isDirty = false;
	const [track, dirty] = solid_js.createSignal(void 0, { equals: false });
	const call = schedule(() => {
		isDirty = true;
		dirty();
	});
	return () => {
		if (!isDirty) call(), track();
		if (isDirty) {
			isDirty = !!listeners;
			return true;
		}
		if (solid_js.getListener()) {
			listeners++;
			solid_js.onCleanup(() => listeners--);
		}
		return false;
	};
}
//#endregion
//#region node_modules/.pnpm/dequal@2.0.3/node_modules/dequal/dist/index.mjs
var has = Object.prototype.hasOwnProperty;
function find(iter, tar, key) {
	for (key of iter.keys()) if (dequal(key, tar)) return key;
}
function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;
	if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();
		if (ctor === Array) {
			if ((len = foo.length) === bar.length) while (len-- && dequal(foo[len], bar[len]));
			return len === -1;
		}
		if (ctor === Set) {
			if (foo.size !== bar.size) return false;
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === "object") {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}
		if (ctor === Map) {
			if (foo.size !== bar.size) return false;
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === "object") {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) return false;
			}
			return true;
		}
		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len = foo.byteLength) === bar.byteLength) while (len-- && foo.getInt8(len) === bar.getInt8(len));
			return len === -1;
		}
		if (ArrayBuffer.isView(foo)) {
			if ((len = foo.byteLength) === bar.byteLength) while (len-- && foo[len] === bar[len]);
			return len === -1;
		}
		if (!ctor || typeof foo === "object") {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}
	return foo !== foo && bar !== bar;
}
//#endregion
//#region src/helper/other.ts
/** 图片文件扩展名缩写 */
const fileType = {
	j: "jpg",
	p: "png",
	g: "gif",
	w: "webp",
	b: "bmp"
};
/** 将调试变量挂到全局 CRSD 对象上 */
const exposeToGlobal = (obj) => {};
const throttle = (fn, wait = 100) => leadingAndTrailing(throttle$1, fn, wait);
const debounce = (fn, wait = 100) => debounce$1(fn, wait);
const sleep = (ms) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});
const clamp = (min, val, max) => Math.max(Math.min(max, val), min);
const inRange = (min, val, max) => val >= min && val <= max;
const getFileName = (url) => /.+\\/(?<name>[^?]+)/u.exec(url)?.groups?.name;
const isString = (val) => typeof val === "string";
const isNumber = (val) => typeof val === "number";
const isArray = (val) => Array.isArray(val);
/** 判断两个数是否在指定误差范围内相等 */
const approx = (val, target, range = 1) => Math.abs(target - val) <= range;
/** 创建一个只会执行一次的函数，并缓存首次调用的返回值 */
const once = (fn) => {
	let wrapper = (...args) => {
		const result = fn(...args);
		wrapper = () => result;
		return result;
	};
	return (...args) => wrapper(...args);
};
function range(a, b, c) {
	switch (typeof b) {
		case "undefined": return [...Array.from({ length: a }).keys()];
		case "number": {
			const list = [];
			for (let i = a; i < b; i++) list.push(c ? c(i) : i);
			return list;
		}
		case "function": return Array.from({ length: a }, (_, i) => b(i));
		case "string": return Array.from({ length: a }, () => b);
	}
}
/** 判断节点是否为元素节点 */
const isHTMLElement = (node) => node.nodeType === Node.ELEMENT_NODE;
/** 判断节点是否为图片元素节点 */
const isImageElement = (node) => node.nodeName === "IMG";
/**
* 对 document.querySelector 的封装
* 将默认返回类型改为 HTMLElement
*/
const querySelector = (selector) => document.querySelector(selector);
/**
* 对 document.querySelector 的封装
* 将默认返回类型改为 HTMLElement
*/
const querySelectorAll = (selector) => [...document.querySelectorAll(selector)];
/** 返回 Dom 的点击函数 */
const querySelectorClick = (selector, textContent) => {
	let getDom;
	if (typeof selector === "function") getDom = selector;
	else if (textContent) getDom = () => querySelectorAll(selector).find((e) => e.textContent?.includes(textContent));
	else getDom = () => querySelector(selector);
	if (getDom()) return () => getDom()?.click();
};
/** 找出数组中出现最多次的元素 */
const getMostItem = (list) => {
	const counts = /* @__PURE__ */ new Map();
	for (const val of list) counts.set(val, (counts.get(val) ?? 0) + 1);
	return [...counts.entries()].reduce((maxItem, item) => maxItem[1] > item[1] ? maxItem : item)[0];
};
/** 判断字符串是否为 URL */
const isUrl = (text) => {
	try {
		return Boolean(new URL(text));
	} catch {
		return false;
	}
};
/** 将 blob 数据作为文件保存至本地 */
const saveAs = (blob, name = "download") => {
	const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	a.download = name;
	a.rel = "noopener";
	a.href = URL.createObjectURL(blob);
	setTimeout(() => a.dispatchEvent(new MouseEvent("click")));
};
/** 滚动页面到指定元素的所在位置 */
const scrollIntoView = (selector, behavior = "instant") => querySelector(selector)?.scrollIntoView({ behavior });
/** 确保函数在同一时间下只有一个在运行 */
const singleThreaded = (callback, initState) => {
	const state = {
		running: false,
		argList: [],
		continueRun: (...args) => state.argList.length > 0 || state.argList.push(args),
		...initState
	};
	const work = async () => {
		if (state.argList.length === 0) return;
		const args = state.argList.shift();
		try {
			state.running = true;
			await callback(state, ...args);
		} catch (error) {
			await sleep(100);
			if (state.argList.length === 0) throw error;
		} finally {
			if (state.abandon) state.argList.length = 0;
			if (state.argList.length > 0) setTimeout(work, state.timeout);
			else state.running = false;
		}
	};
	return (...args) => {
		state.argList.push(args);
		if (!state.running) return work();
	};
};
/**
* 限制 Promise 并发
* @param fnList 任务函数列表
* @param callBack 成功执行一个 Promise 后调用，主要用于显示进度
* @param limit 限制数
* @returns 所有 Promise 的返回值
*/
const plimit = async (fnList, callBack = void 0, limit = 10) => {
	let doneNum = 0;
	const totalNum = fnList.length;
	const resList = [];
	const execPool = /* @__PURE__ */ new Set();
	const taskList = fnList.map((fn, i) => {
		let p;
		return () => {
			p = (async () => {
				resList[i] = await fn();
				doneNum += 1;
				execPool.delete(p);
				callBack?.(doneNum, totalNum, resList, i);
			})();
			execPool.add(p);
		};
	});
	while (doneNum !== totalNum) {
		while (taskList.length > 0 && execPool.size < limit) taskList.shift()();
		await Promise.race(execPool);
	}
	return resList;
};
/** Promise 并发队列 */
var PQueue = class {
	wait = /* @__PURE__ */ new Set();
	running = /* @__PURE__ */ new Set();
	done = /* @__PURE__ */ new Set();
	handleTask;
	concurrency;
	constructor(handleTask, concurrency = 1) {
		this.handleTask = handleTask;
		this.concurrency = concurrency;
	}
	has = (item) => this.running.has(item) || this.done.has(item) || this.wait.has(item);
	async processQueue() {
		if (this.running.size >= this.concurrency || this.wait.size === 0) return;
		const [item] = this.wait;
		if (item === void 0) return;
		this.wait.delete(item);
		if (!this.running.has(item)) try {
			this.running.add(item);
			await this.handleTask(item);
			this.done.add(item);
		} catch (error) {
			console.error(error);
		} finally {
			this.running.delete(item);
		}
		return this.processQueue();
	}
	add(item) {
		if (this.has(item)) return;
		this.wait.add(item);
		this.processQueue();
	}
	set(...items) {
		this.wait.clear();
		this.wait = new Set(items.filter((item) => !this.has(item)));
		this.processQueue();
	}
	clear() {
		this.wait.clear();
		this.done.clear();
	}
};
/**
* 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
* @param hexColor 十六进制颜色。例如 #112233
*/
const needDarkMode = (hexColor) => {
	const r = Number.parseInt(hexColor.slice(1, 3), 16);
	const g = Number.parseInt(hexColor.slice(3, 5), 16);
	const b = Number.parseInt(hexColor.slice(5, 7), 16);
	return (r * 299 + g * 587 + b * 114) / 1e3 < 128;
};
async function wait(fn, timeout = Infinity, waitTime = 100) {
	let res = await fn();
	let _timeout = timeout;
	while (_timeout > 0 && !res) {
		await sleep(waitTime);
		_timeout -= waitTime;
		res = await fn();
	}
	return res;
}
function waitDom(selector, count = 1, timeout) {
	return wait(() => {
		const elements = document.querySelectorAll(selector);
		return elements.length >= count ? [...elements] : void 0;
	}, timeout);
}
/** 等待指定的图片元素加载完成 */
const waitImgLoad = (target, timeout) => new Promise((resolve, reject) => {
	const img = typeof target === "string" ? new Image() : target;
	if (img.complete && img.naturalHeight) resolve(img);
	const id = timeout ? window.setTimeout(() => reject(/* @__PURE__ */ new Error("timeout")), timeout) : void 0;
	const handleError = (e) => {
		window.clearTimeout(id);
		reject(new Error(e.message));
	};
	const handleLoad = () => {
		window.clearTimeout(id);
		img.removeEventListener("error", handleError);
		resolve(img);
	};
	img.addEventListener("load", handleLoad, { once: true });
	img.addEventListener("error", handleError, { once: true });
	if (typeof target === "string") img.src = target;
});
/** 将指定的布尔值转换为字符串或未定义 */
const boolDataVal = (val) => val ? "" : void 0;
/** 测试图片 url 能否正确加载 */
const testImgUrl = (url) => new Promise((resolve) => {
	const img = new Image();
	img.onload = () => resolve(true);
	img.onerror = () => resolve(false);
	img.src = url;
});
const canvasToBlob = (canvas, type, quality = 1) => {
	if (canvas instanceof OffscreenCanvas) return canvas.convertToBlob({
		type,
		quality
	});
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("Canvas toBlob failed")), type, quality);
	});
};
/**
* 求 a 和 b 的差集，相当于从 a 中删去和 b 相同的属性
*
* 不会修改参数对象，返回的是新对象
*/
const difference = (a, b) => {
	const res = {};
	const keys = Object.keys(a);
	for (const key of keys) if (typeof a[key] === "object" && typeof b[key] === "object") {
		const _res = difference(a[key], b[key]);
		if (Object.keys(_res).length > 0) res[key] = _res;
	} else if (a[key] !== b?.[key]) res[key] = a[key];
	return res;
};
const _assign = (a, b) => {
	const res = JSON.parse(JSON.stringify(a));
	const keys = Object.keys(b);
	for (const key of keys) if (res[key] === void 0) res[key] = b[key];
	else if (typeof b[key] === "object") {
		const _res = _assign(res[key], b[key]);
		if (Object.keys(_res).length > 0) res[key] = _res;
	} else if (res[key] !== b[key]) res[key] = b[key];
	return res;
};
/**
* Object.assign 的深拷贝版，不会导致子对象属性的缺失
*
* 不会修改参数对象，返回的是新对象
*/
const assign = (target, ...sources) => {
	let res = target;
	for (const source of sources) if (typeof source === "object") res = _assign(res, source);
	return res;
};
/** 根据路径获取对象下的指定值 */
const byPath = (obj, path, handleVal) => {
	const keys = typeof path === "string" ? path.split(".") : path;
	let target = obj;
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		while (!Reflect.has(target, key) && i < keys.length) {
			i += 1;
			if (keys[i] === void 0) break;
			key += \`.\${keys[i]}\`;
		}
		if (handleVal && i > keys.length - 2 && Reflect.has(target, key)) {
			const res = handleVal(target, key);
			while (i < keys.length - 1) {
				target = target[key];
				i += 1;
				key = keys[i];
			}
			if (res !== void 0) target[key] = res;
			break;
		}
		target = target[key];
	}
	if (target === obj) return null;
	return target;
};
const requestIdleCallback$1 = (callback, timeout) => {
	if (Reflect.has(window, "requestIdleCallback")) return window.requestIdleCallback(callback, { timeout });
	return window.setTimeout(callback, 16);
};
/** 获取键盘事件的编码 */
const getKeyboardCode = (e) => {
	let { key } = e;
	switch (key) {
		case "Shift":
		case "Control":
		case "Alt": return key;
	}
	key = key.replaceAll(/\\b[A-Z]\\b/gu, (match) => match.toLowerCase());
	if (e.ctrlKey) key = \`Ctrl + \${key}\`;
	if (e.altKey) key = \`Alt + \${key}\`;
	if (e.shiftKey) key = \`Shift + \${key}\`;
	return key;
};
/** 将快捷键的编码转换成更易读的形式 */
const keyboardCodeToText = (code) => code.replace("Control", "Ctrl").replace("ArrowUp", "↑").replace("ArrowDown", "↓").replace("ArrowLeft", "←").replace("ArrowRight", "→").replace(/^\\s$/u, "Space");
/** 将 HTML 字符串转换为 DOM 对象 */
const domParse = (html) => new DOMParser().parseFromString(html, "text/html");
/**
* 劫持修改原网页上的函数
*
* 如果传入函数的所需参数为零，将在原函数执行完后自动调用
*/
const hijackFn = (fnName, fn) => {
	const rawFn = unsafeWindow[fnName];
	unsafeWindow[fnName] = fn.length === 0 ? (...args) => {
		const res = rawFn(...args);
		fn();
		return res;
	} : (...args) => fn(rawFn, args);
};
/**
* 确保指定 key 的值一定存在
* 如果对应值不存在，则使用 defaultValue 来设置值，然后返回该值
* defaultValue 可以是默认值，或者返回默认值的函数
* 也可以是使用了 GM.setValue 来设置默认值的函数（此时也会返回被设置的值）
*/
const ensureGmValue = async (name, defaultValue) => {
	const value = await GM.getValue(name);
	if (value !== void 0) return value;
	if (typeof defaultValue !== "function") {
		await GM.setValue(name, defaultValue);
		return defaultValue;
	}
	const fnRes = await defaultValue();
	if (fnRes !== void 0) {
		await GM.setValue(name, fnRes);
		return fnRes;
	}
	return await GM.getValue(name);
};
/** 根据范围文本提取指定范围的元素的 index */
const extractRange = (rangeText, length) => {
	const list = /* @__PURE__ */ new Set();
	for (const text of rangeText.replaceAll(/[^\\d,-]/gu, "").split(",")) if (/^\\d+$/u.test(text)) list.add(Number(text) - 1);
	else if (/^\\d*-\\d*$/u.test(text)) {
		let [start, end] = text.split("-").map(Number);
		end ||= length;
		for (start--, end--; start <= end; start++) list.add(start);
	}
	return list;
};
/** extractRange 的逆向，按照相同的语法表述一个结果数组 */
const descRange = (list, length) => {
	let text = "";
	const nowRange = [];
	const pushRange = (newIndex) => {
		if (nowRange.length === 0) return;
		if (text.length > 0) text += ", ";
		if (nowRange.length === 1) text += nowRange[0] + 1;
		else {
			const end = newIndex === void 0 && nowRange[1] === length - 1 ? "" : nowRange[1] + 1;
			text += \`\${nowRange[0] + 1}-\${end}\`;
		}
		nowRange.length = 0;
		if (newIndex !== void 0) nowRange[0] = newIndex;
	};
	for (const i of list) switch (nowRange.length) {
		case 0:
			nowRange[0] = i;
			break;
		case 1:
			if (i === nowRange[0] + 1) nowRange[1] = i;
			else pushRange(i);
			break;
		case 2: if (i === nowRange[1] + 1) nowRange[1] = i;
		else pushRange(i);
	}
	pushRange();
	return text;
};
/** 监听 url 变化 */
const onUrlChange = (fn, handleUrl = (location) => location.href) => {
	let lastUrl = "";
	const refresh = singleThreaded(async () => {
		if (!await wait(() => handleUrl(location) !== lastUrl, 5e3)) return;
		const nowUrl = handleUrl(location);
		await fn(lastUrl, nowUrl);
		lastUrl = nowUrl;
	});
	const controller = new AbortController();
	for (const eventName of ["click", "popstate"]) window.addEventListener(eventName, refresh, {
		capture: true,
		signal: controller.signal
	});
	refresh();
	return () => controller.abort();
};
/** wait，但是只在 url 变化时判断 */
const waitUrlChange = (isValidUrl) => new Promise((resolve) => {
	const abort = onUrlChange(async () => {
		const res = await isValidUrl();
		if (!res) return;
		resolve(res);
		abort();
	});
});
var AnimationFrame = class {
	animationId = 0;
	call = (force) => {
		if (!force && this.animationId) return;
		this.animationId = requestAnimationFrame(this.frame);
	};
	cancel = () => {
		if (!this.animationId) return;
		cancelAnimationFrame(this.animationId);
		this.animationId = 0;
	};
};
/** 锁定屏幕禁止自动熄屏 */
var WakeLock = class {
	isSupported = false;
	lock = null;
	constructor() {
		if (!("wakeLock" in navigator)) return;
		this.isSupported = true;
	}
	on = async () => {
		if (!this.isSupported) return null;
		try {
			this.lock = await navigator.wakeLock.request("screen");
			return this.lock.released;
		} catch {
			return false;
		}
	};
	off = async () => {
		if (!this.lock) return;
		await this.lock.release();
		this.lock = null;
	};
};
/**
* 获取图片像素数据
*
* 传入 maxSize 时按最长边缩放到该尺寸内
*/
const getImageData = (img, maxSize) => {
	const { naturalWidth: width, naturalHeight: height } = img;
	if (!width || !height) throw new Error(\`图片未加载完成: \${img.src}\`);
	const scale = maxSize && maxSize > 0 ? Math.min(maxSize / width, maxSize / height) : 1;
	const w = Math.max(1, Math.floor(width * scale));
	const h = Math.max(1, Math.floor(height * scale));
	const ctx = new OffscreenCanvas(w, h).getContext("2d", { willReadFrequently: true });
	if (scale !== 1) ctx.imageSmoothingEnabled = false;
	ctx.drawImage(img, 0, 0, w, h);
	return ctx.getImageData(0, 0, w, h);
};
const withEventStop = (handler) => (e) => {
	e.stopPropagation();
	e.preventDefault();
	if (handler) handler(e);
};
/** 判断版本号1是否小于版本号2 */
const versionLt = (version1, version2) => {
	const v1 = version1.split(".").map(Number);
	const v2 = version2.split(".").map(Number);
	for (let i = 0; i < 3; i++) {
		const num1 = v1[i] ?? 0;
		const num2 = v2[i] ?? 0;
		if (num1 !== num2) return num1 < num2;
	}
	return false;
};
//#endregion
//#region src/helper/i18n.ts
const [lang, setLang] = solid_js.createSignal("zh");
const setInitLang = async () => setLang(await helper_languages.getInitLang());
const t = solid_js.createRoot(() => {
	solid_js.createEffect(solid_js.on(lang, () => helper_languages.setSaveLang(lang()), { defer: true }));
	const locales = solid_js.createMemo(() => {
		switch (lang()) {
			case "en": return en_default;
			case "ru": return ru_default;
			default: return zh_default;
		}
	});
	return (keys, variables) => {
		let text = byPath(locales(), keys) ?? "";
		if (variables) for (const [k, v] of Object.entries(variables)) text = text.replaceAll(\`{{\${k}}}\`, String(v));
		return text;
	};
});
//#endregion
//#region src/helper/logger.ts
const prefix = ["%cComicRead", "background-color: #607d8b; color: white; padding: 2px 4px; border-radius: 4px;"];
const log = (...args) => console.log(...prefix, ...args);
log.warn = (...args) => console.warn(...prefix, ...args);
log.error = (...args) => console.error(...prefix, ...args);
//#endregion
//#region node_modules/.pnpm/@solid-primitives+trigger@1.2.4_solid-js@1.9.14/node_modules/@solid-primitives/trigger/dist/index.js
const triggerOptions = !solid_js_web.isServer && solid_js.DEV ? {
	equals: false,
	name: "trigger"
} : { equals: false };
const triggerCacheOptions = !solid_js_web.isServer && solid_js.DEV ? {
	equals: false,
	internal: true
} : triggerOptions;
var TriggerCache = class {
	#map;
	constructor(mapConstructor = Map) {
		this.#map = new mapConstructor();
	}
	dirty(key) {
		if (solid_js_web.isServer) return;
		this.#map.get(key)?.$$();
	}
	dirtyAll() {
		if (solid_js_web.isServer) return;
		for (const trigger of this.#map.values()) trigger.$$();
	}
	track(key) {
		if (!solid_js.getListener()) return;
		let trigger = this.#map.get(key);
		if (!trigger) {
			const [$, $$] = solid_js.createSignal(void 0, triggerCacheOptions);
			this.#map.set(key, trigger = {
				$,
				$$,
				n: 1
			});
		} else trigger.n++;
		solid_js.onCleanup(() => {
			if (--trigger.n === 0) queueMicrotask(() => trigger.n === 0 && this.#map.delete(key));
		});
		trigger.$();
	}
};
//#endregion
//#region node_modules/.pnpm/@solid-primitives+map@0.7.4_solid-js@1.9.14/node_modules/@solid-primitives/map/dist/index.js
const $OBJECT = Symbol("track-object");
/**
* A reactive version of \`Map\` data structure. All the reads (like \`get\` or \`has\`) are signals, and all the writes (\`delete\` or \`set\`) will cause updates to appropriate signals.
* @param initial initial entries of the reactive map
* @param equals signal equals function, determining if a change should cause an update
* @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/map#ReactiveMap
* @example
* const userPoints = new ReactiveMap<User, number>();
* createEffect(() => {
*    userPoints.get(user1) // => T: number | undefined (reactive)
*    userPoints.has(user1) // => T: boolean (reactive)
*    userPoints.size // => T: number (reactive)
* });
* // apply changes
* userPoints.set(user1, 100);
* userPoints.delete(user2);
* userPoints.set(user1, { foo: "bar" });
*/
var ReactiveMap = class extends Map {
	#keyTriggers = new TriggerCache();
	#valueTriggers = new TriggerCache();
	[Symbol.iterator]() {
		return this.entries();
	}
	constructor(entries) {
		super();
		if (entries) for (const entry of entries) super.set(...entry);
	}
	get size() {
		this.#keyTriggers.track($OBJECT);
		return super.size;
	}
	*keys() {
		this.#keyTriggers.track($OBJECT);
		for (const key of super.keys()) yield key;
	}
	*values() {
		this.#valueTriggers.track($OBJECT);
		for (const value of super.values()) yield value;
	}
	*entries() {
		this.#keyTriggers.track($OBJECT);
		this.#valueTriggers.track($OBJECT);
		for (const entry of super.entries()) yield entry;
	}
	forEach(callbackfn, thisArg) {
		this.#keyTriggers.track($OBJECT);
		this.#valueTriggers.track($OBJECT);
		super.forEach(callbackfn, thisArg);
	}
	has(key) {
		this.#keyTriggers.track(key);
		return super.has(key);
	}
	get(key) {
		this.#valueTriggers.track(key);
		return super.get(key);
	}
	set(key, value) {
		const hadNoKey = !super.has(key);
		const hasChanged = super.get(key) !== value;
		const result = super.set(key, value);
		if (hasChanged || hadNoKey) solid_js.batch(() => {
			if (hadNoKey) {
				this.#keyTriggers.dirty($OBJECT);
				this.#keyTriggers.dirty(key);
			}
			if (hasChanged) {
				this.#valueTriggers.dirty($OBJECT);
				this.#valueTriggers.dirty(key);
			}
		});
		return result;
	}
	delete(key) {
		const isDefined = super.get(key) !== void 0;
		const result = super.delete(key);
		if (result) solid_js.batch(() => {
			this.#keyTriggers.dirty($OBJECT);
			this.#valueTriggers.dirty($OBJECT);
			this.#keyTriggers.dirty(key);
			if (isDefined) this.#valueTriggers.dirty(key);
		});
		return result;
	}
	clear() {
		if (super.size === 0) return;
		solid_js.batch(() => {
			this.#keyTriggers.dirty($OBJECT);
			this.#valueTriggers.dirty($OBJECT);
			for (const key of super.keys()) {
				this.#keyTriggers.dirty(key);
				this.#valueTriggers.dirty(key);
			}
			super.clear();
		});
	}
};
//#endregion
//#region node_modules/.pnpm/@solid-primitives+set@0.7.4_solid-js@1.9.14/node_modules/@solid-primitives/set/dist/index.js
const $KEYS = Symbol("track-keys");
/**
* A reactive version of a Javascript built-in \`Set\` class.
* @see https://github.com/solidjs-community/solid-primitives/tree/main/packages/set#ReactiveSet
* @example
* const set = new ReactiveSet([1,2,3]);
* [...set] // reactive on any change
* set.has(2) // reactive on change to the result
* // apply changes
* set.add(4)
* set.delete(2)
* set.clear()
*/
var ReactiveSet = class extends Set {
	#triggers = new TriggerCache();
	constructor(values) {
		super();
		if (values) for (const value of values) super.add(value);
	}
	[Symbol.iterator]() {
		return this.values();
	}
	get size() {
		this.#triggers.track($KEYS);
		return super.size;
	}
	has(value) {
		this.#triggers.track(value);
		return super.has(value);
	}
	keys() {
		return this.values();
	}
	*values() {
		this.#triggers.track($KEYS);
		for (const value of super.values()) yield value;
	}
	*entries() {
		this.#triggers.track($KEYS);
		for (const entry of super.entries()) yield entry;
	}
	forEach(callbackfn, thisArg) {
		this.#triggers.track($KEYS);
		super.forEach(callbackfn, thisArg);
	}
	add(value) {
		if (!super.has(value)) {
			super.add(value);
			solid_js.batch(() => {
				this.#triggers.dirty(value);
				this.#triggers.dirty($KEYS);
			});
		}
		return this;
	}
	delete(value) {
		const result = super.delete(value);
		if (result) solid_js.batch(() => {
			this.#triggers.dirty(value);
			this.#triggers.dirty($KEYS);
		});
		return result;
	}
	clear() {
		if (!super.size) return;
		solid_js.batch(() => {
			this.#triggers.dirty($KEYS);
			for (const member of super.values()) this.#triggers.dirty(member);
			super.clear();
		});
	}
};
//#endregion
//#region src/helper/solidJs.ts
let publicOwner;
solid_js.createRoot(() => {
	publicOwner = solid_js.getOwner();
});
/** 会自动设置 equals 的 createSignal */
const createEqualsSignal = ((init, options) => solid_js.createSignal(init, {
	equals: dequal,
	...options
}));
/** 会自动设置 equals 和 createRoot 的 createMemo */
const createRootMemo = ((fn, init, options) => {
	if (fn.name === "bound readSignal") return fn;
	const _init = init ?? fn(void 0);
	const _options = options?.equals === void 0 && typeof _init === "object" ? {
		...options,
		equals: dequal
	} : options;
	return solid_js.getOwner() ? solid_js.createMemo(fn, _init, _options) : solid_js.runWithOwner(publicOwner, () => solid_js.createMemo(fn, _init, _options));
});
/** 节流的 createMemo */
const createThrottleMemo = (fn, wait = 100, init = fn(void 0), options) => {
	const scheduled = createScheduled((_fn) => throttle(_fn, wait));
	return createRootMemo((prev) => scheduled() ? fn(prev) : prev, init, options);
};
const createMemoMap = (fnMap) => {
	const memoMap = Object.fromEntries(Object.entries(fnMap).map(([key, fn]) => [key, createRootMemo(fn)]));
	return createRootMemo(() => {
		const obj = {};
		for (const key of Object.keys(memoMap)) Reflect.set(obj, key, memoMap[key]());
		return obj;
	});
};
const createRootEffect = ((fn, val, options) => solid_js.getOwner() ? solid_js.createEffect(fn, val, options) : solid_js.runWithOwner(publicOwner, () => solid_js.createEffect(fn, val, options)));
const createEffectOn = ((deps, fn, options) => createRootEffect(solid_js.on(deps, fn, options)));
const onAutoMount = (fn) => {
	const owner = solid_js.getOwner();
	if (!owner) return fn(owner);
	solid_js.onMount(() => {
		const cleanFn = fn(owner);
		if (cleanFn) solid_js.onCleanup(cleanFn);
	});
};
//#endregion
//#region src/helper/useCache.ts
const promisifyRequest = (request) => new Promise((resolve, reject) => {
	request.onsuccess = () => resolve(request.result);
	request.onerror = () => reject(request.error);
});
const openDb = (name, version, initSchema) => new Promise((resolve, reject) => {
	const request = indexedDB.open(\`ComicReadScript\${name}\`, version);
	request.onupgradeneeded = () => initSchema(request.result);
	request.onsuccess = () => resolve(request.result);
	request.onerror = (error) => {
		console.error("数据库打开失败", error);
		reject(/* @__PURE__ */ new Error("数据库打开失败"));
	};
});
const useCache = async (schema, name = "", version = 2) => {
	const db = await openDb(name, version, typeof schema === "function" ? schema : (db) => {
		for (const storeName of db.objectStoreNames) if (!Reflect.has(schema, storeName)) db.deleteObjectStore(storeName);
		for (const storeName of Object.keys(schema)) if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: schema[storeName] });
	});
	return {
		set: (storeName, value) => promisifyRequest(db.transaction(storeName, "readwrite").objectStore(storeName).put(value)),
		get: (storeName, query) => promisifyRequest(db.transaction(storeName, "readonly").objectStore(storeName).get(query)),
		del: (storeName, query) => promisifyRequest(db.transaction(storeName, "readwrite").objectStore(storeName).delete(query)),
		each(storeName, callback) {
			const request = db.transaction(storeName, "readwrite").objectStore(storeName).openCursor();
			request.onsuccess = async function onsuccess(event) {
				const cursor = event.target.result;
				if (!cursor) return;
				await callback(cursor.value, cursor);
				cursor.continue();
			};
		}
	};
};
//#endregion
//#region src/helper/useDrag.ts
const createPointerState = (e, type = "down") => {
	const xy = [e.clientX, e.clientY];
	return {
		id: e.pointerId,
		type,
		xy,
		initial: xy,
		last: xy,
		startTime: performance.now(),
		target: e.target
	};
};
const useDrag = ({ ref, handleDrag, easyMode, handleClick, skip, setCapture, touches = /* @__PURE__ */ new Map() }) => {
	onAutoMount(() => {
		const controller = new AbortController();
		const options = {
			capture: false,
			passive: true,
			signal: controller.signal
		};
		let allowClick = -1;
		const handleDown = (e) => {
			if (skip?.(e)) return;
			e.stopPropagation();
			if (!easyMode?.() && e.buttons !== 1) return;
			if (setCapture) ref.setPointerCapture(e.pointerId);
			const state = createPointerState(e);
			touches.set(e.pointerId, state);
			handleDrag(state, e);
			allowClick = window.setTimeout(() => {
				allowClick = 0;
			}, 300);
		};
		const handleMove = (e) => {
			e.preventDefault();
			if (!easyMode?.() && e.buttons !== 1) return;
			const state = touches.get(e.pointerId);
			if (!state) return;
			state.type = "move";
			state.xy = [e.clientX, e.clientY];
			handleDrag(state, e);
			state.last = state.xy;
			if (allowClick > 0 && (Math.abs(e.clientX - state.initial[0]) > 5 || Math.abs(e.clientY - state.initial[1]) > 5)) {
				window.clearTimeout(allowClick);
				allowClick = -2;
			}
		};
		const handleUp = (e) => {
			e.stopPropagation();
			ref.releasePointerCapture(e.pointerId);
			const state = touches.get(e.pointerId);
			if (!state) return;
			touches.delete(e.pointerId);
			state.type = "up";
			state.xy = [e.clientX, e.clientY];
			if (handleClick && allowClick && touches.size === 0 && approx(state.xy[0] - state.initial[0], 0, 5) && approx(state.xy[1] - state.initial[1], 0, 5)) handleClick(e, state.target);
			window.clearTimeout(allowClick);
			handleDrag(state, e);
		};
		const handleCancel = (e) => {
			e.stopPropagation();
			ref.releasePointerCapture(e.pointerId);
			const state = touches.get(e.pointerId);
			if (!state) return;
			state.type = "cancel";
			handleDrag(state, e);
			touches.clear();
		};
		ref.addEventListener("pointerdown", handleDown, options);
		ref.addEventListener("pointermove", handleMove, {
			...options,
			passive: false
		});
		ref.addEventListener("pointerup", handleUp, options);
		ref.addEventListener("pointercancel", handleCancel, options);
		if (easyMode) {
			ref.addEventListener("pointerover", handleDown, options);
			ref.addEventListener("pointerout", handleUp, options);
		}
		ref.addEventListener("click", (e) => {
			if (allowClick > 0 && touches.size === 0 || skip?.(e)) return;
			e.stopPropagation();
			e.preventDefault();
		}, { capture: true });
		return () => controller.abort();
	});
};
//#endregion
//#region src/helper/useStore.ts
const useStore = (initState) => {
	const [store, _setState] = solid_js_store.createStore(initState);
	const setState = (...args) => {
		if (args.length === 1 && typeof args[0] === "function") return _setState(solid_js_store.produce(args[0]));
		return _setState(...args);
	};
	return {
		store,
		setState
	};
};
//#endregion
//#region src/helper/useStyle.ts
const useStyleSheet = (e) => {
	const styleSheet = new CSSStyleSheet();
	onAutoMount(() => {
		const root = e?.getRootNode() ?? document;
		root.adoptedStyleSheets = [...root.adoptedStyleSheets, styleSheet];
		return () => {
			const index = root.adoptedStyleSheets.indexOf(styleSheet);
			if (index !== -1) root.adoptedStyleSheets.splice(index, 1);
		};
	});
	return styleSheet;
};
const useStyle = (cssText, e) => {
	const styleSheet = useStyleSheet(e);
	if (typeof cssText === "string") styleSheet.replaceSync(cssText);
	else createEffectOn(createRootMemo(cssText), (style) => styleSheet.replaceSync(style));
};
/**
* 将同一帧内的所有 CSS 变更合并为一次 DOM 写入
*
* 避免相关属性因更新时序不一致导致浏览器判定值无效
*/
const setStyle = (() => {
	const list = [];
	let id = 0;
	const flush = () => {
		id = 0;
		for (const [style, key, val] of list) if (val === void 0 || val === "") style.removeProperty(key);
		else style.setProperty(key, typeof val === "string" ? val : \`\${val}\`);
		list.length = 0;
	};
	return (style, key, val) => {
		list.push([
			style,
			key,
			val
		]);
		id ||= requestAnimationFrame(flush);
	};
})();
/** 用 CSSStyleSheet 实现和修改 style 一样的效果 */
const useStyleMemo = (selector, styleMapArg, e) => {
	const styleSheet = useStyleSheet(e);
	const getSelector = typeof selector === "string" ? () => selector : createRootMemo(selector);
	styleSheet.insertRule(\`\${getSelector()} { }\`);
	const { style } = styleSheet.cssRules[0];
	if (typeof selector !== "string") createEffectOn(getSelector, (s) => {
		styleSheet.cssRules[0].selectorText = s;
	});
	const styleMapList = Array.isArray(styleMapArg) ? styleMapArg : [styleMapArg];
	for (const styleMap of styleMapList) if (typeof styleMap === "object") for (const [key, val] of Object.entries(styleMap)) {
		const styleText = createRootMemo(val);
		createEffectOn(styleText, (newVal) => setStyle(style, key, newVal));
	}
	else {
		const styleMemoMap = createRootMemo(styleMap);
		createEffectOn(styleMemoMap, (map) => {
			for (const [key, val] of Object.entries(map)) setStyle(style, key, val);
		});
	}
};
function css(arg1, arg2, ...rest) {
	if (typeof arg1 !== "object" || !("raw" in arg1)) {
		if (arg2 instanceof Element || arg2 === null || arg2 === void 0) return useStyle(arg1, arg2);
		return useStyleMemo(arg1, arg2, rest[0]);
	}
	const [styles, ...values] = [
		arg1,
		arg2,
		...rest
	];
	let e;
	let startIdx = 0;
	if (values[0] instanceof Element) {
		[e] = values;
		startIdx = 1;
	}
	useStyle(() => {
		let text = styles[startIdx];
		for (let i = startIdx; i < values.length; i++) text += \`\${typeof values[i] === "function" ? values[i]() : values[i]}\${styles[i + 1]}\`;
		return text;
	}, e);
}
//#endregion
exports.AnimationFrame = AnimationFrame;
exports.FaviconProgress = FaviconProgress;
exports.PQueue = PQueue;
exports.ReactiveMap = ReactiveMap;
exports.ReactiveSet = ReactiveSet;
exports.WakeLock = WakeLock;
exports.approx = approx;
exports.assign = assign;
exports.boolDataVal = boolDataVal;
exports.byPath = byPath;
exports.canvasToBlob = canvasToBlob;
exports.clamp = clamp;
exports.createEffectOn = createEffectOn;
exports.createEqualsSignal = createEqualsSignal;
exports.createMemoMap = createMemoMap;
exports.createRootEffect = createRootEffect;
exports.createRootMemo = createRootMemo;
exports.createScheduled = createScheduled;
exports.createThrottleMemo = createThrottleMemo;
exports.css = css;
exports.debounce = debounce;
exports.descRange = descRange;
exports.difference = difference;
exports.domParse = domParse;
exports.ensureGmValue = ensureGmValue;
exports.exposeToGlobal = exposeToGlobal;
exports.extractRange = extractRange;
exports.fileType = fileType;
exports.getFileName = getFileName;
exports.getImageData = getImageData;
exports.getKeyboardCode = getKeyboardCode;
exports.getMostItem = getMostItem;
exports.hijackFn = hijackFn;
exports.inRange = inRange;
exports.isArray = isArray;
exports.isEqual = dequal;
exports.isHTMLElement = isHTMLElement;
exports.isImageElement = isImageElement;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isUrl = isUrl;
exports.keyboardCodeToText = keyboardCodeToText;
exports.lang = lang;
exports.log = log;
exports.mountComponents = mountComponents;
exports.needDarkMode = needDarkMode;
exports.onAutoMount = onAutoMount;
exports.onUrlChange = onUrlChange;
exports.once = once;
exports.plimit = plimit;
exports.promisifyRequest = promisifyRequest;
exports.querySelector = querySelector;
exports.querySelectorAll = querySelectorAll;
exports.querySelectorClick = querySelectorClick;
exports.range = range;
exports.requestIdleCallback = requestIdleCallback$1;
exports.saveAs = saveAs;
exports.scrollIntoView = scrollIntoView;
exports.setInitLang = setInitLang;
exports.setLang = setLang;
exports.singleThreaded = singleThreaded;
exports.sleep = sleep;
exports.t = t;
exports.testImgUrl = testImgUrl;
exports.throttle = throttle;
exports.useCache = useCache;
exports.useDrag = useDrag;
exports.useFaviconProgress = useFaviconProgress;
exports.useStore = useStore;
exports.versionLt = versionLt;
exports.wait = wait;
exports.waitDom = waitDom;
exports.waitImgLoad = waitImgLoad;
exports.waitUrlChange = waitUrlChange;
exports.withEventStop = withEventStop;
`,
	"request": `\nlet components_Toast = require("components/Toast");
let helper = require("helper");
//#region src/request.ts
const xmlHttpRequest = (details) => new Promise((resolve, reject) => {
	const handleError = (error) => {
		details.onerror?.(error);
		console.error("GM_xmlhttpRequest Error", error);
		reject(new Error(error?.responseText || "GM_xmlhttpRequest Error"));
	};
	const abort = GM_xmlhttpRequest({
		...details,
		onload(res) {
			details.onload?.call(res, res);
			resolve(res);
		},
		onerror: handleError,
		ontimeout: handleError,
		onabort: handleError
	});
	details.signal?.addEventListener("abort", () => abort.abort());
});
/** 通过流读取 blob，并回报下载进度 */
const readBlobWithProgress = async (res, onprogress) => {
	const total = Number(res.headers.get("Content-Length")) || 0;
	const reader = res.body?.getReader();
	if (!reader) return new Blob();
	const chunks = [];
	let loaded = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			loaded += value.byteLength;
			onprogress({
				loaded,
				total,
				done: loaded,
				position: loaded,
				lengthComputable: total > 0,
				totalSize: total
			});
		}
	} finally {
		reader.releaseLock();
	}
	return new Blob(chunks);
};
/** 发起请求 */
const request = async (url, details = {}, retryNum = 0, errorNum = 0) => {
	const headers = { Referer: location.href };
	const errorText = \`\${details?.errorText ?? helper.t("alert.comic_load_error")}\\nurl: \${url}\`;
	details.fetch ??= url.startsWith("/") || url.startsWith(location.origin);
	try {
		if (details.fetch || typeof GM_xmlhttpRequest === "undefined") {
			const res = await fetch(url, {
				method: "GET",
				headers,
				signal: AbortSignal.timeout?.(details.timeout ?? 1e4),
				body: details.data,
				...details
			});
			if (!details.noCheckCode && res.status !== 200) {
				helper.log.error(errorText, res);
				throw new Error(errorText);
			}
			let response = null;
			switch (details.responseType) {
				case "arraybuffer":
					response = await res.arrayBuffer();
					break;
				case "blob":
					response = details.onprogress && res.body ? await readBlobWithProgress(res, details.onprogress) : await res.blob();
					break;
				case "json": response = await res.json();
			}
			const _res = {
				status: res.status,
				statusText: res.statusText,
				response,
				responseText: response ? "" : await res.text()
			};
			details.onload?.call(_res, _res);
			return _res;
		}
		let targetUrl = url;
		if (url.startsWith("//")) targetUrl = \`http:\${url}\`;
		else if (url.startsWith("/")) targetUrl = \`\${location.origin}\${url}\`;
		const res = await xmlHttpRequest({
			method: "GET",
			url: targetUrl,
			headers,
			timeout: 1e4,
			...details
		});
		if (!details.noCheckCode && res.status !== 200) {
			helper.log.error(errorText, res);
			throw new Error(errorText);
		}
		if (details.responseType === "json" && res.responseText && (typeof res.response !== "object" || Object.keys(res.response).length === 0)) try {
			Reflect.set(res, "response", JSON.parse(res.responseText));
		} catch {}
		return res;
	} catch (error) {
		if (details && details.retryFetch && retryNum === 0) {
			console.warn("retryFetch", url);
			details.fetch = !details.fetch;
			return request(url, details, retryNum + 1, errorNum);
		}
		if (errorNum >= retryNum) {
			(details.noTip ? console.error : components_Toast.toast.error)(\`\${errorText}\\nerror: \${error.message}\`);
			throw new Error(errorText, { cause: error });
		}
		helper.log.error(errorText, error);
		await helper.sleep(1e3);
		return request(url, details, retryNum, errorNum + 1);
	}
};
/** 轮流向多个 api 发起请求 */
const eachApi = async (url, baseUrlList, details) => {
	for (const baseUrl of baseUrlList) try {
		return await request(\`\${baseUrl}\${url}\`, {
			...details,
			noTip: true
		});
	} catch {}
	const errorText = details?.errorText ?? helper.t("alert.comic_load_error");
	if (!details?.noTip) components_Toast.toast.error(errorText);
	helper.log.error("所有 api 请求均失败", url, baseUrlList, details);
	throw new Error(errorText);
};
const downloadImgHeaders = {
	Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
	"User-Agent": navigator.userAgent,
	Referer: location.href
};
const downloadImg = async (url, details, retryNum = 0) => {
	if (url.startsWith("blob:")) return (await fetch(url)).blob();
	return (await request(url, {
		responseType: "blob",
		errorText: helper.t("translation.tip.download_img_failed"),
		headers: downloadImgHeaders,
		retryFetch: true,
		...details
	}, retryNum)).response;
};
//#endregion
exports.downloadImg = downloadImg;
exports.downloadImgHeaders = downloadImgHeaders;
exports.eachApi = eachApi;
exports.request = request;
`,
	"components/Manga": `\n//#region \\0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let solid_js_web = require("solid-js/web");
let helper = require("helper");
let solid_js = require("solid-js");
let solid_js_store = require("solid-js/store");
let request = require("request");
let comlink = require("comlink");
comlink = __toESM(comlink, 1);
let worker_ImageRecognition = require("worker/ImageRecognition");
worker_ImageRecognition = __toESM(worker_ImageRecognition, 1);
let components_Toast = require("components/Toast");
let worker_ImageUpscale = require("worker/ImageUpscale");
worker_ImageUpscale = __toESM(worker_ImageUpscale, 1);
let components_IconButton = require("components/IconButton");
let fflate = require("fflate");
let userscript_supportWorker = require("userscript/supportWorker");
//#region src/components/Manga/store/image.ts
const imgState = {
	imgMap: {},
	imgList: [],
	pageList: [],
	fillEffect: { "-1": true },
	showRange: [0, 0],
	renderRange: [0, 0],
	loadingRange: [0, 0],
	/**
	* 图片显示状态
	*
	* 0 - 页面中的第一张图片
	* 1 - 页面中的最后一张图片
	* '' - 页面中的唯一一张图片
	*/
	imgShowState: {},
	defaultImgType: ""
};
//#endregion
//#region src/components/Manga/actions/translation/translator/MangaImageTranslator/options.ts
/**
* MangaImageTranslator 翻译服务配置选项
*/
/**
* 默认配置
*
* 部分参数使用文档推荐值:
* @see https://github.com/zyddnys/manga-image-translator?tab=readme-ov-file#recommended-options
*/
const mitDefaultOptions = () => ({
	localUrl: void 0,
	detector: {
		detector: "ctd",
		detection_size: "1536",
		box_threshold: .7,
		unclip_ratio: 2.3
	},
	render: { direction: "auto" },
	translator: {
		translator: "gpt3.5",
		target_lang: {
			zh: "CHS",
			en: "ENG",
			ru: "RUS"
		}[helper.lang()] ?? "CHS"
	},
	inpainter: {
		inpainter: "lama_large",
		inpainting_size: "2048"
	},
	mask_dilation_offset: 30
});
/** 分辨率映射 */
const sizeDict = {
	"1024": "S",
	"1536": "M",
	"2048": "L",
	"2560": "X"
};
/** 目标语言选项 */
const targetLanguageOptions = [
	["CHS", "简体中文"],
	["CHT", "繁體中文"],
	["JPN", "日本語"],
	["ENG", "English"],
	["KOR", "한국어"],
	["VIN", "Tiếng Việt"],
	["CSY", "čeština"],
	["NLD", "Nederlands"],
	["FRA", "français"],
	["DEU", "Deutsch"],
	["HUN", "magyar nyelv"],
	["ITA", "italiano"],
	["PLK", "polski"],
	["PTB", "português"],
	["ROM", "limba română"],
	["RUS", "русский язык"],
	["ESP", "español"],
	["TRK", "Türk dili"],
	["IND", "Indonesia"]
];
//#endregion
//#region src/components/Manga/actions/translation/translator/Cotrans/options.ts
/**
* Cotrans 翻译服务配置选项
*/
/** Cotrans 支持的翻译器列表 */
const cotransTranslators = [
	"google",
	"youdao",
	"baidu",
	"deepl",
	"gpt3.5",
	"offline",
	"none"
];
/** Cotrans 默认配置 */
const cotransDefaultOptions = () => ({
	detector: {
		detector: "ctd",
		detection_size: "1536"
	},
	render: { direction: "auto" },
	translator: {
		translator: "gpt3.5",
		target_lang: {
			zh: "CHS",
			en: "ENG",
			ru: "RUS"
		}[helper.lang()] ?? "CHS"
	}
});
//#endregion
//#region src/components/Manga/store/option.ts
const _defaultOption = {
	dir: "rtl",
	scrollbar: {
		position: "auto",
		autoHidden: false,
		showImgStatus: true,
		easyScroll: false
	},
	clickPageTurn: {
		enabled: "ontouchstart" in document.documentElement,
		reverse: false,
		area: "left_right",
		shrinkMenu: false
	},
	firstPageFill: true,
	disableZoom: false,
	darkMode: false,
	autoDarkMode: false,
	swapPageTurnKey: false,
	scroolEnd: "auto",
	alwaysLoadAllImg: false,
	showComment: true,
	preloadPageNum: 20,
	pageNum: 0,
	pageTip: "auto",
	turnPageDuration: 0,
	scrollDuration: 100,
	autoSwitchPageMode: true,
	autoHiddenMouse: true,
	autoFullscreen: false,
	zoom: {
		ratio: 100,
		offset: {
			x: 0,
			y: 0
		}
	},
	scrollMode: {
		enabled: false,
		spacing: 0,
		imgScale: 1,
		adjustToWidth: "disable",
		abreastMode: false,
		abreastDuplicate: .1,
		pageColumns: 1,
		doubleMode: false,
		alignEdge: false
	},
	imgFilter: {
		brightness: 100,
		contrast: 100,
		saturate: 100
	},
	imgRecognition: {
		enabled: false,
		background: false,
		pageFill: true,
		upscale: false,
		crop: false,
		keepMargin: 10
	},
	translation: {
		enabled: false,
		provider: "manga-image-translator",
		onlyDownloadTranslated: false,
		forceRetry: false,
		mit: mitDefaultOptions(),
		cotrans: cotransDefaultOptions()
	},
	autoScroll: {
		enabled: false,
		interval: 3e3,
		distance: 200,
		continuous: true,
		triggerEnd: false
	}
};
const defaultOption = () => structuredClone(_defaultOption);
const optionState = {
	defaultOption: defaultOption(),
	option: defaultOption()
};
//#endregion
//#region src/components/Manga/store/other.ts
const otherState = {
	/** 漫画标题 */
	title: "",
	/**
	* 用于防止滚轮连续滚动导致过快触发事件的锁
	*
	* - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
	*/
	scrollLock: false,
	/** 当前是否处于全屏状态 */
	fullscreen: false,
	rootSize: {
		width: 0,
		height: 0
	},
	scrollbarSize: {
		width: 0,
		height: 0
	},
	/** 卷轴模式下的滚动距离 */
	scrollTop: 0,
	/** 虚拟棘轮的翻页进度（0~1），正为向下滚动 */
	wheelProgress: 0,
	/** 最近一次判定的滚动设备类型 */
	scrollDeviceType: void 0,
	autoScroll: {
		play: false,
		progress: 0
	},
	supportUpscaleImage: true
};
//#endregion
//#region src/components/Manga/store/prop.ts
const propState = {
	commentList: void 0,
	hotkeys: {},
	prop: {
		onExit: void 0,
		onPrev: void 0,
		onNext: void 0,
		onLoading: void 0,
		onOptionChange: void 0,
		onHotkeysChange: void 0,
		editButtonList: (list) => list,
		editSettingList: (list) => list
	}
};
//#endregion
//#region src/components/Manga/store/show.ts
const showState = {
	isMobile: false,
	isDragMode: false,
	isTurnAnimating: false,
	isScrollbarHover: false,
	activePageIndex: 0,
	show: {
		toolbar: false,
		scrollbar: false,
		pageTip: false,
		touchArea: false,
		endPage: void 0
	},
	page: {
		anima: "",
		vertical: true,
		offset: {
			x: {
				pct: 0,
				px: 0
			},
			y: {
				pct: 0,
				px: 0
			}
		}
	}
};
//#endregion
//#region src/components/Manga/store/index.ts
const initStore = {
	...imgState,
	...showState,
	...propState,
	...optionState,
	...otherState
};
const { store, setState } = helper.useStore({ ...initStore });
const refs = {
	root: void 0,
	mangaBox: void 0,
	mangaFlow: void 0,
	touchArea: void 0,
	scrollbar: void 0,
	settingPanel: void 0,
	prev: void 0,
	next: void 0,
	exit: void 0,
	/** 以图片原始 URL 为 key 的 img 元素集合，用于绕过 DOM 查询直接获取图片元素 */
	imgEleMap: {}
};
//#endregion
//#region src/components/Manga/handleComicData.ts
/** 判断图片是否是跨页图 */
const isWideImg = (img) => {
	switch (img.type ?? store.defaultImgType) {
		case "long":
		case "wide": return true;
		default: return false;
	}
};
/** 根据填充页设置双页排列单页图片 */
const arrangeImg = (pageList, fill) => {
	if (pageList.length === 0) return [];
	const newPageList = [];
	let imgCache = fill ? [-1] : [];
	for (const i of pageList) {
		imgCache.push(i);
		if (imgCache.length === 2) {
			newPageList.push(imgCache);
			imgCache = [];
		}
	}
	if (imgCache.length === 1 && imgCache[0] !== -1) {
		imgCache.push(-1);
		newPageList.push(imgCache);
	}
	return newPageList;
};
/** 计算指定图片流中的左右页位置正确的页数 */
const computeAccuracy = (imgList, pageList) => {
	let accuracy = 0;
	for (const [a, b] of pageList) {
		if ((imgList[a]?.blankMargin?.left ?? 0) > .04) accuracy += 1;
		if (b === void 0) break;
		if ((imgList[b]?.blankMargin?.right ?? 0) > .04) accuracy += 1;
	}
	return accuracy;
};
/** 自动切换填充页设置到左右页正确率更高的情况 */
const arrangePage = (pageList, { imgList, fillEffect, nowFillIndex, switchFill }) => {
	const fill = Boolean(fillEffect[nowFillIndex]);
	const newPageList = arrangeImg(pageList, fill);
	if (!switchFill || typeof fillEffect[nowFillIndex] === "number") return newPageList;
	const anotherPageList = arrangeImg(pageList, !fill);
	const anotherAccuracy = computeAccuracy(imgList, anotherPageList);
	if (anotherAccuracy === 0) return newPageList;
	if (anotherAccuracy <= computeAccuracy(imgList, newPageList)) return newPageList;
	helper.log(\`\${nowFillIndex} 自动切换页面填充\`);
	fillEffect[nowFillIndex] = !fill;
	return anotherPageList;
};
/** 根据图片比例和填充页设置对漫画图片进行排列 */
const handleComicData = (imgList, fillEffect, switchFill) => {
	const context = {
		imgList,
		fillEffect,
		nowFillIndex: -1,
		switchFill
	};
	const pageList = [];
	const cacheList = [];
	for (let i = 0; i < imgList.length; i += 1) {
		const img = imgList[i];
		if (!isWideImg(img)) {
			cacheList.push(i);
			if (Reflect.has(fillEffect, i)) Reflect.deleteProperty(fillEffect, i);
			continue;
		}
		if (typeof fillEffect[context.nowFillIndex] === "boolean" && i < imgList.length - 2 && (cacheList.length + (fillEffect[context.nowFillIndex] ? 1 : 0)) % 2 === 1) {
			fillEffect[context.nowFillIndex] = !fillEffect[context.nowFillIndex];
			return handleComicData(imgList, fillEffect, switchFill);
		}
		pageList.push(...arrangePage(cacheList, context), [i]);
		cacheList.length = 0;
		if (fillEffect[i] === void 0) fillEffect[i] = false;
		context.nowFillIndex = i;
	}
	if (cacheList.length > 0) pageList.push(...arrangePage(cacheList, context));
	return pageList;
};
//#endregion
//#region src/components/Manga/actions/memo/img.ts
const imgList = helper.createRootMemo(() => store.imgList.map((url) => store.imgMap[url]));
/** 图片 url 对应的索引 */
const imgIndexMap = helper.createRootMemo(() => {
	const map = /* @__PURE__ */ new Map();
	for (const [index, url] of store.imgList.entries()) {
		const indexList = map.get(url);
		if (indexList) indexList.push(index);
		else map.set(url, [index]);
	}
	return map;
});
/** 当前显示页面 */
const activePage = helper.createRootMemo(() => store.pageList[store.activePageIndex] ?? []);
/** 当前显示的第一张图片的 index */
const activeImgIndex = helper.createRootMemo(() => activePage().find((i) => i !== -1) ?? 0);
/** 找到指定页面所处的图片流 */
const findFillIndex = (pageIndex, fillEffect) => {
	let nowFillIndex = pageIndex;
	while (!Reflect.has(fillEffect, nowFillIndex)) nowFillIndex -= 1;
	return nowFillIndex;
};
/** 当前所处的图片流 */
const nowFillIndex = helper.createRootMemo(() => findFillIndex(activeImgIndex(), store.fillEffect));
/** 预加载页数 */
const preloadNum = helper.createRootMemo(() => ({
	back: store.option.preloadPageNum,
	front: Math.floor(store.option.preloadPageNum / 2)
}));
/** 获取图片列表中指定属性的中位数 */
const getImgMedian = (sizeFn) => {
	const list = imgList().filter((img) => img.loadType === "loaded" && img.width).map(sizeFn).toSorted((a, b) => a - b);
	if (list.length < 3) return null;
	return list[Math.floor(list.length / 2)];
};
/** 图片占位尺寸 */
const placeholderSize = helper.createThrottleMemo(() => ({
	width: getImgMedian((img) => img.width) ?? 800,
	height: getImgMedian((img) => img.height) ?? 1200
}), 500);
//#endregion
//#region src/components/Manga/actions/helper.ts
const getImg = (i, state = store) => state.imgMap[state.imgList[i]];
/** 找到指定 url 图片在 imgList 里的 index */
const getImgIndexs = (url) => imgIndexMap().get(url) ?? [];
/** 找到指定 url 图片的 dom */
const getImgEle = (target, loaded = false) => {
	const url = typeof target === "number" ? store.imgList[target] : target;
	for (const element of refs.imgEleMap[url] ?? []) if (!loaded || element.complete) return element;
};
/** 触发 onOptionChange */
const triggerOnOptionChange = helper.throttle(() => store.prop.onOptionChange?.(helper.difference(store.option, store.defaultOption)), 1e3);
/** 在 option 后手动触发 onOptionChange */
const setOption = (...args) => {
	if (args.length === 1 && typeof args[0] === "function") setState((state) => args[0](state.option, state));
	else setState("option", ...args);
	triggerOnOptionChange();
};
/** 创建用于将 ref 绑定到对应 state 上的工具函数 */
const bindRef = (name) => (e) => Reflect.set(refs, name, e);
const watchDomSize = (name, e) => {
	const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
		if (!contentRect.width || !contentRect.height) return;
		setState((state) => {
			state[name] = {
				width: contentRect.width,
				height: contentRect.height
			};
		});
	});
	resizeObserver.disconnect();
	resizeObserver.observe(e);
	solid_js.onCleanup(() => resizeObserver.disconnect());
};
/** 将界面恢复到正常状态 */
const resetUI = (state) => {
	state.show.toolbar = false;
	state.show.scrollbar = false;
	state.show.touchArea = false;
	state.show.pageTip = false;
};
const focus = () => requestAnimationFrame(() => {
	refs.mangaBox?.click();
	refs.mangaBox?.focus();
});
/** 将函数的 state 参数变为可选 */
const withOptionalState = (fn) => (...args) => {
	if (args.length < fn.length) {
		let result;
		setState((state) => {
			result = fn(...[...args, state]);
		});
		return result;
	}
	return fn(...args);
};
const closeScrollLock = helper.debounce(() => setState("scrollLock", false), 100);
/** 打开滚动锁，并在之后自动关闭 */
const openScrollLock = withOptionalState((state) => {
	state.scrollLock = true;
	closeScrollLock();
});
const bindOption = (...path) => ({
	value: helper.byPath(store.option, path),
	onChange: (val) => setOption(...path, val)
});
//#endregion
//#region src/components/Manga/actions/memo/options.ts
/** 当前是否为并排卷轴模式 */
const isAbreastMode = helper.createRootMemo(() => store.option.scrollMode.enabled && store.option.scrollMode.abreastMode);
/** 当前是否为双页卷轴模式 */
const isDoubleMode = helper.createRootMemo(() => store.option.scrollMode.enabled && store.option.scrollMode.doubleMode && !store.option.scrollMode.abreastMode);
/** 当前是否为单页卷轴模式 */
const isSingleMode = helper.createRootMemo(() => store.option.scrollMode.enabled && !store.option.scrollMode.doubleMode && !store.option.scrollMode.abreastMode);
/** 当前是否为普通卷轴模式（包含了双页卷轴模式） */
const isScrollMode = helper.createRootMemo(() => store.option.scrollMode.enabled && !store.option.scrollMode.abreastMode);
/** 当前是否正在卷轴模式下使用自动缩放值 */
const isUseAutoScale = helper.createRootMemo(() => isScrollMode() && typeof store.option.scrollMode.adjustToWidth === "number");
/** 当前是否开启了识别背景色 */
const isEnableBg = helper.createRootMemo(() => store.option.imgRecognition.enabled && store.option.imgRecognition.background);
/** 当前是否开启了图像放大 */
const isUpscale = helper.createRootMemo(() => !store.isMobile && store.option.imgRecognition.enabled && store.option.imgRecognition.upscale);
/** 根据视区宽高判断单双页模式 */
const autoPageNum = helper.createThrottleMemo(() => store.rootSize.width >= store.rootSize.height ? 2 : 1);
/** 当前使用的单双页模式 */
const pageNum = helper.createRootMemo(() => store.option.pageNum || autoPageNum());
/** 是否为单页模式 */
const isOnePageMode = helper.createRootMemo(() => {
	if (store.isMobile || store.imgList.length <= 1) return true;
	if (store.option.scrollMode.enabled) {
		if (store.option.scrollMode.abreastMode) return true;
		return !store.option.scrollMode.doubleMode;
	}
	return pageNum() === 1;
});
//#endregion
//#region src/components/Manga/actions/memo/abreastScroll.ts
/** 并排卷轴模式下的全局滚动填充 */
const [abreastScrollFill, _setAbreastScrollFill] = solid_js.createSignal(0);
/** 并排卷轴模式下的每列布局 */
const abreastArea = helper.createRootMemo((prev) => {
	if (!isAbreastMode()) return prev;
	const columns = [[]];
	const position = {};
	let length = 0;
	const rootHeight = store.rootSize.height;
	if (!rootHeight || store.imgList.length === 0) return {
		columns,
		position,
		length
	};
	const repeatHeight = rootHeight * store.option.scrollMode.abreastDuplicate;
	/** 当前图片在当前列的所在高度 */
	let top = abreastScrollFill();
	while (top > rootHeight) {
		top -= rootHeight - repeatHeight;
		columns.push([]);
	}
	for (let i = 0; i < store.imgList.length; i++) {
		const img = getImg(i);
		const imgPosition = [];
		const imgHeight = img.size.height;
		length += imgHeight;
		let height = imgHeight;
		while (height > 0) {
			columns.at(-1).push(i);
			imgPosition.push({
				column: columns.length - 1,
				top
			});
			if (top < 0 && imgPosition.length > 1) top = 0;
			const availableHeight = rootHeight - top;
			top += height;
			height -= availableHeight;
			if (top < rootHeight) continue;
			columns.push([]);
			top = height - imgHeight;
			if (!repeatHeight || columns.length === 1) continue;
			top += repeatHeight;
			height = Math.min(imgHeight, height + repeatHeight);
			/** 为了复现而出现的空白部分高度 */
			let emptyTop = top;
			let prevImgIndex = i;
			while (prevImgIndex >= 1 && emptyTop > 0) {
				prevImgIndex -= 1;
				columns.at(-1).push(prevImgIndex);
				const prevImgHeight = getImg(prevImgIndex).size.height;
				emptyTop -= prevImgHeight;
				position[prevImgIndex].push({
					column: columns.length - 1,
					top: emptyTop
				});
			}
		}
		position[i] = imgPosition;
	}
	return {
		columns,
		position,
		length
	};
}, {
	columns: [],
	position: {},
	length: 0
});
/** 头尾滚动的限制值 */
const scrollFillLimit = helper.createRootMemo(() => abreastArea().length - store.rootSize.height);
const setAbreastScrollFill = (val) => _setAbreastScrollFill(helper.clamp(-scrollFillLimit(), val, scrollFillLimit()));
/** 并排卷轴模式下的列宽度 */
const abreastColumnWidth = helper.createRootMemo(() => isAbreastMode() ? placeholderSize().width * store.option.scrollMode.imgScale : 0);
/** 并排卷轴模式下当前要显示的列 */
const abreastShowColumn = helper.createThrottleMemo(() => {
	if (!isAbreastMode() || abreastArea().columns.length === 0) return {
		start: 0,
		end: 0
	};
	const columnWidth = abreastColumnWidth() + store.option.scrollMode.spacing * 7;
	return {
		start: helper.clamp(0, Math.floor(store.page.offset.x.px / columnWidth), abreastArea().columns.length - 1),
		end: helper.clamp(0, Math.floor((store.page.offset.x.px + store.rootSize.width) / columnWidth), abreastArea().columns.length - 1)
	};
});
/** 并排卷轴模式下的漫画流宽度 */
const abreastContentWidth = helper.createRootMemo(() => abreastArea().columns.length * abreastColumnWidth() + (abreastArea().columns.length - 1) * store.option.scrollMode.spacing * 7);
/** 并排卷轴模式下的最大滚动距离 */
const abreastScrollWidth = helper.createRootMemo(() => abreastContentWidth() - store.rootSize.width);
/** 并排卷轴模式下每个图片所在位置的样式 */
const imgAreaStyle = helper.createRootMemo(() => {
	if (!isAbreastMode()) return "";
	let styleText = "";
	for (const index of store.imgList.keys()) {
		let imgNum = 0;
		for (const { column, top } of abreastArea().position[index] ?? []) {
			const itemStyle = \`grid-area: _\${column} !important; transform: translateY(\${top}px);\`;
			styleText += \`#_\${index}_\${imgNum} { \${itemStyle} }\\n\`;
			imgNum += 1;
		}
	}
	return styleText;
});
//#endregion
//#region src/components/Manga/actions/image.ts
/** 重新计算图片排列 */
const updatePageData = (state) => {
	const lastActiveImgIndex = activeImgIndex();
	let newPageList = [];
	newPageList = isOnePageMode() ? state.imgList.map((_, i) => [i]) : handleComicData(state.imgList.map((url) => state.imgMap[url]), state.fillEffect, state.option.imgRecognition.pageFill);
	if (helper.isEqual(state.pageList, newPageList)) return;
	state.pageList = newPageList;
	if (lastActiveImgIndex !== activeImgIndex()) {
		const newActivePageIndex = state.pageList.findIndex((page) => page.includes(lastActiveImgIndex));
		if (newActivePageIndex !== -1) state.activePageIndex = newActivePageIndex;
	}
};
updatePageData.throttle = helper.throttle(() => setState(updatePageData), 100);
/**
* 将处理图片的相关变量恢复到初始状态
*
* 必须按照以下顺序调用
* 1. 修改 imgList
* 2. resetImgState
* 3. updatePageData
*/
const resetImgState = (state) => {
	if (state.imgList.length === 0) {
		state.fillEffect = { "-1": true };
		return;
	}
	if (typeof state.fillEffect["-1"] === "boolean") state.fillEffect["-1"] = state.option.firstPageFill && state.imgList.length > 3;
};
helper.createEffectOn([pageNum, isOnePageMode], () => setState(updatePageData));
//#endregion
//#region src/components/Manga/actions/memo/observer.ts
/** 记录每张图片所在的页面 */
const imgPageMap = helper.createRootMemo(() => {
	const map = {};
	for (let i = 0; i < store.pageList.length; i++) for (const imgIndex of store.pageList[i]) if (imgIndex !== -1) map[imgIndex] = i;
	return map;
});
/** 滚动距离 */
const scrollTop = helper.createRootMemo(() => isAbreastMode() ? store.page.offset.x.px : store.scrollTop);
const bindScrollTop = (dom) => {
	dom.addEventListener("scroll", () => {
		if (helper.approx(dom.scrollTop, store.scrollTop)) return;
		setState("scrollTop", dom.scrollTop);
	}, { passive: true });
};
const darkModeQuery = matchMedia("(prefers-color-scheme: dark)");
const autoSwitchDarkMode = (query) => {
	if (!store.option.autoDarkMode) return;
	if (query.matches === store.option.darkMode) return;
	setState("option", "darkMode", query.matches);
};
darkModeQuery.addEventListener("change", autoSwitchDarkMode);
autoSwitchDarkMode(darkModeQuery);
helper.createEffectOn(() => store.option.autoDarkMode, () => autoSwitchDarkMode(darkModeQuery));
helper.createEffectOn(() => store.rootSize.width, (width) => {
	const isMobile = helper.inRange(1, width, 800);
	if (isMobile === store.isMobile) return;
	setState((state) => {
		state.isMobile = isMobile;
		resetImgState(state);
		updatePageData(state);
	});
});
//#endregion
//#region src/components/Manga/actions/memo/scrollMode.ts
/** 双页卷轴模式下的页面列表（按行分组） */
const scrollPageList = helper.createRootMemo(() => {
	if (!isDoubleMode()) return store.pageList.map((page) => [page]);
	const { pageColumns } = store.option.scrollMode;
	if (pageColumns <= 1) return store.pageList.map((page) => [page]);
	const rows = [];
	for (let i = 0; i < store.pageList.length; i += pageColumns) rows.push(store.pageList.slice(i, i + pageColumns));
	return rows;
});
/** 卷轴模式下每行高度 */
const pageHeightList = helper.createRootMemo(() => {
	if (!isScrollMode()) return [];
	if (!isDoubleMode()) return imgList().map((img) => img.size.height ?? 0);
	const { pageColumns } = store.option.scrollMode;
	const doubleWidth = store.rootSize.width / pageColumns / 2;
	const imgDisplayHeight = ({ width, height }) => width < doubleWidth && store.option.scrollMode.adjustToWidth === "disable" ? height : height * (doubleWidth / width);
	return scrollPageList().map((row) => Math.max(...row.flatMap((indexs) => indexs.filter((i) => i !== -1).map((i) => imgDisplayHeight(getImg(i).size)))));
});
/** 卷轴模式下每页位置 */
const pageTopList = helper.createRootMemo(() => {
	if (!isScrollMode()) return [];
	const list = Array.from({ length: store.pageList.length });
	const rows = scrollPageList();
	for (let top = 0, i = 0, rowIdx = 0; rowIdx < rows.length; rowIdx++) {
		const row = rows[rowIdx];
		for (let col = 0; col < row.length; col++) list[i + col] = top;
		i += row.length;
		top += pageHeightList()[rowIdx] + store.option.scrollMode.spacing * 7;
	}
	return list;
});
/** 卷轴模式下漫画流的总高度 */
const contentHeight = helper.createRootMemo(() => {
	if (!isScrollMode()) return 0;
	return (pageTopList().at(-1) ?? 0) + (pageHeightList().at(-1) ?? 0);
});
/** 获取卷轴模式下指定页的位置 */
const getPageTop = (index) => {
	if (Reflect.has(pageTopList(), index)) return pageTopList()[index];
	if (index < 0) return 0;
	return contentHeight();
};
/** 找到卷轴模式下指定高度上显示的页面 */
const findTopPage = (top, initIndex = 0) => {
	if (top > contentHeight()) return pageTopList().length - 1;
	for (let i = initIndex; i < pageTopList().length; i++) if (pageTopList()[i] > top) return i === 0 ? 0 : i - 1;
	return pageTopList().length - 1;
};
//#endregion
//#region src/components/Manga/actions/memo/scroll.ts
/** 滚动内容的滚动进度 */
const scrollProgress = helper.createRootMemo(() => {
	if (store.option.scrollMode.enabled) return scrollTop();
	return store.activePageIndex;
});
/** 滚动内容的总长度 */
const scrollLength = helper.createRootMemo(() => {
	if (store.option.scrollMode.enabled) {
		if (store.option.scrollMode.abreastMode) return abreastContentWidth();
		return contentHeight();
	}
	return store.pageList.length;
});
/** 滚动内容的滚动进度百分比 */
const scrollPercentage = helper.createRootMemo(() => scrollProgress() / scrollLength());
/** 当前是否已经滚动到顶部 */
const isTop = helper.createRootMemo(() => scrollPercentage() === 0);
/** 滚动条元素的长度 */
const scrollDomLength = helper.createRootMemo(() => Math.max(store.scrollbarSize.width, store.scrollbarSize.height));
/** 滚动条滑块长度 */
const sliderHeight = helper.createRootMemo(() => {
	let itemLength = 1;
	if (isScrollMode()) itemLength = store.rootSize.height;
	if (isAbreastMode()) itemLength = store.rootSize.width;
	return itemLength / scrollLength();
});
/** 当前是否已经滚动到底部 */
const isBottom = helper.createRootMemo(() => scrollPercentage() + sliderHeight() >= .9999);
/** 滚动条滑块的中心点高度 */
const sliderMidpoint = helper.createRootMemo(() => scrollDomLength() * (scrollPercentage() + sliderHeight() / 2));
/** 滚动条滑块的位置 */
const sliderTop = helper.createRootMemo(() => \`\${scrollPercentage() * scrollDomLength()}px\`);
/** 滚动条位置 */
const scrollPosition = helper.createRootMemo(() => {
	if (store.option.scrollbar.position === "auto") {
		if (store.isMobile) return "top";
		if (isAbreastMode()) return "bottom";
		return store.defaultImgType === "long" ? "bottom" : "right";
	}
	return store.option.scrollbar.position;
});
//#endregion
//#region src/components/Manga/actions/endPage.ts
/** 处理尽头翻页。返回当前是否已抵达尽头 */
const handleEndTurnPage = withOptionalState((dir, state) => {
	if (dir === "prev") switch (state.show.endPage) {
		case "start":
			if (state.scrollLock || store.option.scroolEnd !== "auto") return true;
			state.prop.onPrev?.();
			return true;
		case "end":
			state.show.endPage = void 0;
			return true;
		default: if (isTop()) {
			if (state.scrollLock) return true;
			if (!state.prop.onExit || !state.prop.onPrev || store.option.scroolEnd !== "auto") return true;
			state.show.endPage = "start";
			return true;
		}
	}
	else switch (state.show.endPage) {
		case "end":
			if (state.scrollLock || store.option.scroolEnd === "none") return true;
			if (store.option.scroolEnd === "auto" && state.prop.onNext) state.prop.onNext();
			else state.prop.onExit?.(true);
			return true;
		case "start":
			state.show.endPage = void 0;
			return true;
		default: if (isBottom()) {
			if (state.scrollLock) return true;
			if (!state.prop.onExit) return true;
			state.show.endPage = "end";
			return true;
		}
	}
	return false;
});
//#endregion
//#region src/components/Manga/actions/imageLoad/state.ts
/** 图片加载管理器的持久状态 */
const loadState = {
	/** 图片上次加载出错的时间，用于退避重试 */
	imgErrorMap: /* @__PURE__ */ new Map(),
	/** 尚未加载完成（包含出错）且有 src 的图片 url 集合 */
	unloadedUrlSet: /* @__PURE__ */ new Set(),
	/** 当前没有 src 的图片数量 */
	waitUrlImgNum: 0,
	/** 当前 loadType === 'loading' 的图片 url 集合 */
	loadingUrlSet: new helper.ReactiveSet(),
	/** 存放正在使用「图像识别」功能特殊下载的图片 url 所对应的 AbortController */
	abortMap: /* @__PURE__ */ new Map()
};
const setLoadingUrlSet = (urls) => {
	solid_js.batch(() => {
		loadState.loadingUrlSet.clear();
		for (const url of urls) loadState.loadingUrlSet.add(url);
	});
};
/** 在 \`store.imgList\` 或 \`store.imgMap\` 被修改后，进行完整的状态更新 */
const syncImgLoadState = (state) => {
	loadState.unloadedUrlSet.clear();
	let waitNum = 0;
	const nextLoading = /* @__PURE__ */ new Set();
	for (const url of state.imgList) {
		const img = state.imgMap[url];
		if (!img) continue;
		if (img.src) {
			if (img.loadType !== "loaded") loadState.unloadedUrlSet.add(url);
		} else waitNum += 1;
		if (img.loadType === "loading") nextLoading.add(url);
	}
	loadState.waitUrlImgNum = waitNum;
	setLoadingUrlSet(nextLoading);
};
//#endregion
//#region src/components/Manga/actions/imageType.ts
const isWideType = (type) => type === "wide" || type === "long";
const 单页比例 = 960 / 1080;
const 横幅比例 = 1920 / 1080;
const 条漫比例 = 960 / 1080 / 2;
/** 根据比例判断图片类型 */
const getImgType = (img) => {
	const imgRatio = img.width / img.height;
	if (imgRatio <= 单页比例) return imgRatio < 条漫比例 ? "vertical" : "";
	return imgRatio > 横幅比例 ? "long" : "wide";
};
/** 更新图片类型。返回是否修改了图片类型 */
const updateImgType = (state, draftImg) => {
	const { type } = draftImg;
	if (!draftImg.width || !draftImg.height) return false;
	draftImg.type = getImgType(draftImg);
	if (isWideType(type) !== isWideType(draftImg.type)) updatePageData.throttle();
	return (type ?? state.defaultImgType) !== draftImg.type;
};
/** 是否自动开启过卷轴模式 */
let autoScrollMode = false;
helper.createRootEffect((prevIsWide) => {
	if (store.rootSize.width === 0 || store.rootSize.height === 0) return;
	const defaultImgType = getImgType(placeholderSize());
	if (defaultImgType === store.defaultImgType) return prevIsWide;
	const isWide = isWideType(defaultImgType);
	setState((state) => {
		state.defaultImgType = defaultImgType;
		if (defaultImgType === "vertical" && !autoScrollMode && !state.option.scrollMode.enabled) {
			state.option.scrollMode.enabled = true;
			autoScrollMode = true;
			return;
		}
		if (isWide !== prevIsWide) updatePageData(state);
	});
	return isWide;
}, false);
//#endregion
//#region src/components/Manga/actions/imageSize.ts
/** 计算裁切后的四边比例，没有裁切时返回 null */
const getCropMargin = ({ blankMargin: margin, width, height }, state = store) => {
	const { crop, keepMargin } = state.option.imgRecognition;
	if (!crop || !margin || !width || !height) return null;
	const left = Math.max(0, margin.left - keepMargin / width);
	const right = Math.max(0, margin.right - keepMargin / width);
	const top = Math.max(0, margin.top - keepMargin / height);
	const bottom = Math.max(0, margin.bottom - keepMargin / height);
	if (left + right + top + bottom === 0) return null;
	return {
		left,
		right,
		top,
		bottom
	};
};
/** 获取指定图片的显示尺寸（会将边缘裁切计算在内） */
const getImgDisplaySize = (state, img) => {
	let height = img.height ?? placeholderSize().height;
	let width = img.width ?? placeholderSize().width;
	if (state.option.imgRecognition.crop && img.width && img.height) {
		const crop = getCropMargin(img, state);
		if (crop) {
			width = img.width * (1 - crop.left - crop.right);
			height = img.height * (1 - crop.top - crop.bottom);
		}
	}
	if (!state.option.scrollMode.enabled) return {
		height,
		width
	};
	const setWidth = (w) => {
		height *= w / width;
		width = w;
		return {
			height,
			width
		};
	};
	if (isAbreastMode()) return setWidth(abreastColumnWidth());
	if (state.option.scrollMode.adjustToWidth === "full") return setWidth(state.rootSize.width);
	if (typeof state.option.scrollMode.adjustToWidth === "number") {
		const target = state.option.scrollMode.adjustToWidth;
		const type = img.type ?? state.defaultImgType;
		if (isWideType(type)) {
			const ratio = height / width;
			width = helper.clamp(Math.min(target, state.rootSize.width), width, state.rootSize.width);
			height = width * ratio;
			return {
				height,
				width
			};
		}
		return setWidth(Math.min(target, state.rootSize.width));
	}
	if (state.option.scrollMode.imgScale !== 1) {
		height *= state.option.scrollMode.imgScale;
		width *= state.option.scrollMode.imgScale;
	}
	if (width > state.rootSize.width) return setWidth(state.rootSize.width);
	return {
		height,
		width
	};
};
/** 更新图片尺寸 */
const updateImgSize = withOptionalState((url, width, height, state) => {
	const img = state.imgMap[url];
	if (img.width !== width || img.height !== height) {
		img.width = width;
		img.height = height;
		updateImgType(state, img);
	}
	const size = getImgDisplaySize(state, img);
	if (img.size.width !== size.width || img.size.height !== size.height) Object.assign(img.size, size);
});
helper.createEffectOn([
	placeholderSize,
	() => store.rootSize,
	() => store.option.scrollMode.enabled,
	() => store.option.scrollMode.imgScale,
	() => store.option.scrollMode.abreastMode,
	() => store.option.scrollMode.adjustToWidth,
	() => store.option.imgRecognition.crop,
	() => store.option.imgRecognition.keepMargin
], () => {
	setState((state) => {
		for (const url of state.imgList) {
			const img = state.imgMap[url];
			Object.assign(img.size, getImgDisplaySize(state, img));
		}
	});
});
//#endregion
//#region src/components/Manga/actions/renderPage.ts
/** 获取并排卷轴模式下指定列的指定图片 */
const getAbreastColumnImg = (column, img) => {
	const { columns } = abreastArea();
	return columns[helper.clamp(0, column, columns.length - 1)]?.at(img) ?? 0;
};
/** 计算显示页面 */
const updateShowRange = (state) => {
	if (scrollLength() === 0) {
		state.showRange = [0, 0];
		state.renderRange = state.showRange;
	} else if (!state.option.scrollMode.enabled) {
		state.showRange = [state.activePageIndex, state.activePageIndex];
		state.renderRange = [helper.clamp(0, state.activePageIndex - 1, state.pageList.length - 1), helper.clamp(0, state.activePageIndex + 1, state.pageList.length - 1)];
	} else if (state.option.scrollMode.abreastMode) {
		const { start, end } = abreastShowColumn();
		state.showRange = [getAbreastColumnImg(start, 0), getAbreastColumnImg(end, -1)];
		state.renderRange = [getAbreastColumnImg(start - 2, 0), getAbreastColumnImg(end + 2, -1)];
	} else {
		const top = scrollTop();
		const bottom = scrollTop() + state.rootSize.height;
		const renderTop = top - state.rootSize.height;
		const rednerBottom = bottom + state.rootSize.height;
		const renderTopImg = findTopPage(renderTop);
		const topImg = findTopPage(top, renderTopImg);
		const bottomImg = findTopPage(bottom, topImg);
		const renderBottomImg = findTopPage(rednerBottom, bottomImg);
		state.showRange = [topImg, bottomImg];
		state.renderRange = [renderTopImg, renderBottomImg];
	}
};
helper.createEffectOn([
	scrollLength,
	() => store.option.scrollMode.enabled,
	() => store.activePageIndex,
	() => store.option.scrollMode.abreastMode,
	() => store.rootSize,
	abreastShowColumn,
	scrollTop
], helper.throttle(() => setState(updateShowRange)));
/** 获取指定范围内页面所包含的图片 */
const getRangeImgList = (range) => {
	let list;
	if (range[0] === range[1]) list = new Set(store.pageList[range[0]]);
	else {
		list = /* @__PURE__ */ new Set();
		for (const [a, b] of store.pageList.slice(range[0], range[1] + 1)) {
			list.add(a);
			if (b !== void 0) list.add(b);
		}
	}
	list.delete(-1);
	return list;
};
const renderImgList = helper.createRootMemo(() => getRangeImgList(store.renderRange));
const showImgList = helper.createRootMemo(() => getRangeImgList(store.showRange));
/** 更新每张图片在 store 中的显示状态 */
helper.createEffectOn(() => store.renderRange, () => {
	const newState = {};
	for (let [i] = store.renderRange; i <= store.renderRange[1]; i++) {
		const page = store.pageList[i];
		if (!page) continue;
		const [a, b] = page;
		if (b === void 0) newState[a] = "";
		else {
			newState[a] = 0;
			newState[b] = 1;
		}
	}
	setState("imgShowState", solid_js_store.reconcile(newState));
});
helper.createEffectOn([() => store.showRange, () => store.option.scrollMode.enabled], ([[firstPage], isScrollMode]) => isScrollMode && setState("activePageIndex", firstPage ?? 0));
helper.createEffectOn(showImgList, (showImgs) => {
	if (showImgs.size === 0) return;
	store.prop.onShowImgsChange?.(showImgs, imgList());
}, { defer: true });
//#endregion
//#region src/components/Manga/actions/imageLoad/scheduler.ts
/** 获取指定页数下的头/尾图片 */
const getPageImg = (pageNum, imgType) => {
	const page = store.pageList[pageNum].filter((i) => i !== -1);
	if (page.length === 1) return page[0];
	return imgType === "start" ? Math.min(...page) : Math.max(...page);
};
/** 规划当前要加载的图片 */
const planLoadBatch = () => {
	/** 当前批次中需要改成 loading 的图片 */
	const loadImgList = /* @__PURE__ */ new Set();
	/** 当前加载范围内还没有 src 的图片索引 */
	const waitUrlImgs = /* @__PURE__ */ new Set();
	/** 加载指定图片。返回是否已加载完成 */
	const loadImg = (index) => {
		const img = getImg(index);
		if (!img.src) {
			waitUrlImgs.add(index);
			return true;
		}
		if (img.loadType === "loaded" || img.loadType === "error") return true;
		loadImgList.add(img.src);
		return false;
	};
	/**
	* 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
	* @param target 加载目标页
	* @param loadNum 加载图片数量
	* @returns 返回指定范围内是否还有未加载的图片
	*/
	const loadRangeImg = (target = 0, loadNum = 2) => {
		let start = getPageImg(store.showRange[0], "start");
		let end = getPageImg(store.showRange[1], "end");
		if (target !== 0) {
			if (target < 0) {
				end = start + target;
				start -= 1;
			} else {
				start = end + 1;
				end += target;
			}
			start = helper.clamp(0, start, store.imgList.length - 1);
			end = helper.clamp(0, end, store.imgList.length - 1);
		}
		/** 是否还有未加载的图片 */
		let hasUnloadedImg = false;
		let index = start;
		const condition = start <= end ? () => index <= end : () => index >= end;
		const step = start <= end ? 1 : -1;
		while (condition()) {
			if (!loadImg(index)) hasUnloadedImg = true;
			if (loadImgList.size >= loadNum) return index !== end || hasUnloadedImg;
			index += step;
		}
		return hasUnloadedImg;
	};
	if (store.imgList.length > 0) loadRangeImg() || loadRangeImg(preloadNum().back) || loadRangeImg(-preloadNum().front) || !store.option.alwaysLoadAllImg || loadRangeImg(Infinity, 5) || loadRangeImg(Number.NEGATIVE_INFINITY, 5);
	return {
		loadImgList,
		waitUrlImgs
	};
};
/** 根据当前显示范围重新计算并修改图片加载状态 */
const updateImgLoadType = helper.singleThreaded(() => {
	if (store.showRange[0] < 0 || loadState.unloadedUrlSet.size === 0 && loadState.waitUrlImgNum === 0) return;
	const { loadImgList, waitUrlImgs } = planLoadBatch();
	store.prop.onWaitUrlImgs?.(waitUrlImgs, imgList());
	setState((state) => {
		for (const url of /* @__PURE__ */ new Set([...loadState.loadingUrlSet, ...loadImgList])) {
			const img = state.imgMap[url];
			if (!img) continue;
			if (loadImgList.has(url)) {
				if (img.loadType !== "loading") {
					img.loadType = "loading";
					if (!store.option.imgRecognition.enabled && img.width === void 0) setTimeout(checkImgSize, 0, img.src);
				}
			} else if (img.loadType === "loading") img.loadType = "wait";
		}
	});
	setLoadingUrlSet(loadImgList);
});
helper.createEffectOn([
	preloadNum,
	renderImgList,
	() => store.imgMap,
	() => store.option.alwaysLoadAllImg
], updateImgLoadType);
/** 加载期间尽快获取图片尺寸 */
const checkImgSize = (url) => {
	const imgDom = getImgEle(url);
	if (!imgDom) return;
	const timeoutId = setInterval(() => {
		if (!imgDom?.isConnected || store.option.imgRecognition.enabled) return clearInterval(timeoutId);
		const img = store.imgMap[url];
		if (!img || img.loadType !== "loading") return clearInterval(timeoutId);
		if (imgDom.naturalWidth && imgDom.naturalHeight) {
			updateImgSize(url, imgDom.naturalWidth, imgDom.naturalHeight);
			return clearInterval(timeoutId);
		}
	}, 200);
};
//#endregion
//#region src/components/Manga/actions/imageRecognition.ts
/**
* 在「图像识别」相关功能的配置变更后变更
* 用于在 worker 执行结束后判断数据是否过期
*/
let recognitionVersion = 0;
/** 使所有正在进行的图像识别结果失效 */
const invalidateRecognition = () => {
	recognitionVersion += 1;
	setState((state) => {
		for (const img of Object.values(state.imgMap)) img.recognitionVersion = void 0;
	});
};
/** 判断图片是否处于当前渲染范围内 */
const isInRenderRange = (url) => {
	const renderList = renderImgList();
	return getImgIndexs(url).some((index) => renderList.has(index));
};
const handleImgRecognition = async (url, imgEle) => {
	const img = store.imgMap[url];
	if (!img || img.recognitionVersion !== void 0) return;
	if (!(store.option.imgRecognition.background && img.background === void 0 || store.option.imgRecognition.pageFill && img.blankMargin === void 0 || store.option.imgRecognition.crop && img.blankMargin === void 0)) return;
	if (!isInRenderRange(url)) return;
	imgEle ??= await helper.wait(() => getImgEle(url, true), 1e3);
	if (!imgEle) return helper.log.warn("获取图片元素失败");
	setState("imgMap", url, "recognitionVersion", recognitionVersion);
	const { data, width, height } = helper.getImageData(imgEle, 200);
	initWorker$1();
	await worker_ImageRecognition.default.recognitionImg(comlink.default.transfer(data, [data.buffer]), {
		width,
		height,
		url,
		index: Number(imgEle.alt),
		option: solid_js_store.unwrap(store.option.imgRecognition),
		version: recognitionVersion
	});
};
const initWorker$1 = helper.once(() => {
	const mainFn = {
		log: helper.log,
		updatePageData: helper.throttle(() => setState(updatePageData), 1e3),
		setImg: ({ url, key, val, version }) => {
			if (!Reflect.has(store.imgMap, url)) return;
			if (version !== recognitionVersion) return;
			setState("imgMap", url, key, val);
			if (key === "blankMargin" && store.option.imgRecognition.crop) {
				const { width, height } = store.imgMap[url];
				if (width && height) updateImgSize(url, width, height);
			}
		}
	};
	worker_ImageRecognition.default.setMainFn(comlink.default.proxy(mainFn), Object.keys(mainFn));
});
helper.createEffectOn([
	renderImgList,
	() => store.option.imgRecognition.enabled,
	() => store.option.imgRecognition.background,
	() => store.option.imgRecognition.pageFill,
	() => store.option.imgRecognition.crop
], ([imgList, enabled]) => {
	if (!enabled) return;
	for (const index of imgList) {
		const img = getImg(index);
		if (img.loadType === "loaded") handleImgRecognition(img.src);
	}
});
//#endregion
//#region src/components/Manga/helper.ts
/** 阻止事件冒泡 */
const stopPropagation = (e) => e.stopPropagation();
/** 从头开始播放元素的动画 */
const playAnimation = (e) => {
	if (!e) return;
	for (const animation of e.getAnimations()) {
		animation.cancel();
		animation.play();
	}
};
const downloadImg = async (imgUrl, details, retryNum = 0) => {
	const url = store.imgMap[imgUrl]?.blobUrl ?? imgUrl;
	if (url.startsWith("blob:")) return (await fetch(url)).blob();
	const res = await request.downloadImg(url, details, retryNum);
	if (Reflect.has(store.imgMap, imgUrl)) setState("imgMap", imgUrl, "blobUrl", URL.createObjectURL(res));
	return res;
};
//#endregion
//#region src/components/Manga/actions/translation/TranslationTask.ts
/**
* 翻译任务基类
*
* 每个翻译任务都是独立的实例，负责单张图片的完整翻译流程。
* 子类需要实现 {@link work} 方法来定义具体的翻译逻辑。
*/
var TranslationTask = class {
	url;
	constructor(url) {
		this.url = url;
	}
	/** 更新当前图片的翻译状态消息 */
	setMessage(message) {
		setState("imgMap", this.url, "translationMessage", message);
	}
	/** 下载图片 */
	async download(url = this.url, details) {
		try {
			return await downloadImg(url, details);
		} catch (error) {
			helper.log.error(error);
			store.prop.onImgError?.(url);
			throw new Error(helper.t("translation.tip.download_img_failed"), { cause: error });
		}
	}
	/** 缩小过大的图片（超过 4096px） */
	async resize(blob) {
		const img = store.imgMap[this.url];
		const w = img.width;
		const h = img.height;
		if (w <= 4096 && h <= 4096) return blob;
		try {
			const scale = Math.min(4096 / w, 4096 / h);
			const width = Math.floor(w * scale);
			const height = Math.floor(h * scale);
			const imgDom = await helper.waitImgLoad(URL.createObjectURL(blob));
			const canvas = new OffscreenCanvas(width, height);
			const ctx = canvas.getContext("2d");
			ctx.imageSmoothingQuality = "high";
			ctx.drawImage(imgDom, 0, 0, width, height);
			URL.revokeObjectURL(imgDom.src);
			return await helper.canvasToBlob(canvas);
		} catch (error) {
			helper.log.error("缩小图片尺寸时出错", error);
			return blob;
		}
	}
	/**
	* 执行翻译任务
	* @returns 翻译后的图片 URL
	*/
	async run() {
		try {
			await this.init();
			this.setMessage(helper.t("translation.tip.img_downloading"));
			let blob = await this.download();
			blob = await this.resize(blob);
			return await this.work(blob);
		} catch (error) {
			this.setMessage(error.message);
			helper.log.error("翻译出错", error);
			components_Toast.toast.error(error.message);
			throw error;
		}
	}
	/** 初始化任务，子类可重写 */
	async init() {}
};
//#endregion
//#region src/components/Manga/actions/translation/translator/Cotrans/index.ts
/**
* Cotrans 翻译任务实现
*
* 使用 cotrans.touhou.ai 公共服务进行图片翻译。
* 通过 WebSocket 或轮询获取翻译状态，最终合并原图和翻译蒙版。
*/
/**
* Cotrans 翻译任务
*
* 使用 cotrans.touhou.ai 公共翻译服务。
* 返回的是翻译蒙版，需要与原图合并。
*/
var Cotrans = class Cotrans extends TranslationTask {
	/** 创建上传表单数据 */
	static createFormData(blob) {
		const formData = new FormData();
		const fileName = \`image.\${blob.type.split("/").at(-1)}\`;
		const file = new File([blob], fileName, { type: blob.type });
		const options = store.option.translation.cotrans;
		formData.append("file", file);
		formData.append("mime", file.type);
		formData.append("size", sizeDict[options.detector.detection_size]);
		formData.append("detector", options.detector.detector);
		formData.append("direction", options.render.direction);
		formData.append("translator", options.translator.translator);
		formData.append("target_language", options.translator.target_lang);
		formData.append("retry", \`\${store.option.translation.forceRetry}\`);
		return formData;
	}
	/** 上传图片到 Cotrans 服务器 */
	async upload(blob) {
		try {
			return await request.request("https://api.cotrans.touhou.ai/task/upload/v1", {
				method: "POST",
				data: Cotrans.createFormData(blob)
			});
		} catch (error) {
			helper.log.error(error);
			throw new Error(helper.t("translation.tip.upload_error"), { cause: error });
		}
	}
	/** 解析上传响应 */
	parse(json) {
		let data;
		try {
			data = JSON.parse(json);
		} catch (error) {
			throw new Error(\`\${helper.t("translation.tip.upload_return_error")}：\${json}\`, { cause: error });
		}
		if ("error_id" in data) throw new Error(\`\${helper.t("translation.tip.upload_return_error")}：\${data.error_id}\`);
		if (!data.id) throw new Error(helper.t("translation.tip.id_not_returned"));
		return data;
	}
	/** 处理 WebSocket 或轮询返回的消息 */
	handleMessage(msg) {
		switch (msg.type) {
			case "result": return msg.result.translation_mask;
			case "pending":
				this.setMessage(helper.t("translation.tip.pending", { pos: msg.pos }));
				break;
			case "status":
				this.setMessage(helper.t(\`translation.status.\${msg.status}\`) || msg.status);
				break;
			case "error": throw new Error(\`\${helper.t("translation.status.error")}：id \${msg.error_id}\`);
			case "not_found": throw new Error(\`\${helper.t("translation.status.error")}：Not Found\`);
		}
	}
	/** 通过轮询等待翻译完成 */
	async waitByPolling(id) {
		let result;
		while (result === void 0) {
			const res = await request.request(\`https://api.cotrans.touhou.ai/task/\${id}/status/v1\`, { responseType: "json" });
			result = this.handleMessage(res.response);
			await helper.sleep(1e3);
		}
		return result;
	}
	/** 通过 WebSocket 等待翻译完成，失败时降级为轮询 */
	wait(id) {
		const ws = new WebSocket(\`wss://api.cotrans.touhou.ai/task/\${id}/event/v1\`);
		if (ws.readyState > 1) return this.waitByPolling(id);
		return new Promise((resolve, reject) => {
			ws.onmessage = (e) => {
				try {
					const result = this.handleMessage(JSON.parse(e.data));
					if (result) resolve(result);
				} catch (error) {
					reject(error);
				}
			};
		});
	}
	/** 将原图与翻译蒙版合并 */
	async mergeImage(rawImage, maskUri) {
		const img = await helper.waitImgLoad(URL.createObjectURL(rawImage));
		const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
		const canvasCtx = canvas.getContext("2d");
		canvasCtx.drawImage(img, 0, 0);
		const mask = await helper.waitImgLoad(URL.createObjectURL(await this.download(maskUri)));
		canvasCtx.drawImage(mask, 0, 0);
		return await helper.canvasToBlob(canvas);
	}
	async work(blob) {
		this.setMessage(helper.t("translation.tip.upload"));
		const res = await this.upload(blob);
		const data = this.parse(res.responseText);
		const translation_mask = data.result?.translation_mask || await this.wait(data.id);
		const result = await this.mergeImage(blob, translation_mask);
		return URL.createObjectURL(result);
	}
};
//#endregion
//#region src/components/Manga/actions/translation/translator/MangaImageTranslator/helper.ts
/**
* MangaImageTranslator 辅助函数
*
* 提供 API 请求、URL 构建等通用功能。
*/
/** 获取 API 基础 URL，优先使用自定义地址 */
const apiUrl = () => store.option.translation.mit?.localUrl?.replace(/\\/$/u, "") || "http://127.0.0.1:5003";
/** ngrok 代理需要的特殊请求头 */
const headers$1 = helper.createRootMemo(() => {
	if (apiUrl().includes(".ngrok-free.")) return { "ngrok-skip-browser-warning": "69420" };
});
/**
* 发送 API 请求
* @param url API 路径（不含基础 URL）
* @param details 请求配置
* @param retryNum 重试次数
*/
const api = (url, details, retryNum = 0) => request.request(\`\${apiUrl()}\${url}\`, {
	...details,
	headers: {
		...details?.headers,
		...headers$1()
	}
}, retryNum);
//#endregion
//#region src/components/Manga/actions/translation/translator/MangaImageTranslator/index.ts
/**
* MangaImageTranslator 翻译任务实现
*
* 支持自部署的 manga-image-translator 服务。
* 同时兼容新旧版本 API，支持流式和非流式响应。
*
* API 文档: http://0.0.0.0:5003/docs
*/
/**
* MangaImageTranslator 翻译任务
*
* 支持自部署服务，可使用自定义服务器地址。
* 优先使用流式 API 获取实时翻译状态。
*/
var MIT = class MIT extends TranslationTask {
	isOldVersion = false;
	/** 创建上传表单数据 */
	static createFormData(blob, isOldVersion) {
		const formData = new FormData();
		const fileName = \`image.\${blob.type.split("/").at(-1)}\`;
		const file = new File([blob], fileName, { type: blob.type });
		const { localUrl: _, ...options } = store.option.translation.mit;
		if (isOldVersion) {
			formData.append("file", file);
			formData.append("mime", file.type);
			formData.append("size", sizeDict[options.detector.detection_size]);
			formData.append("detector", options.detector.detector);
			formData.append("direction", options.render.direction);
			formData.append("translator", options.translator.translator);
			formData.append("target_lang", options.translator.target_lang);
			formData.append("retry", \`\${store.option.translation.forceRetry}\`);
		} else {
			formData.append("image", file);
			formData.append("config", JSON.stringify(options));
		}
		return formData;
	}
	async init() {
		const res = await api("/", { errorText: \`\${helper.t("setting.option.paragraph_translation")} - \${helper.t("alert.server_connect_failed")}\` });
		this.isOldVersion = res.responseText.includes("value=\\"S\\">1024px</");
	}
	/** 旧版 API：上传图片获取任务 ID */
	async oldUpload(blob) {
		try {
			return (await api("/submit", {
				method: "POST",
				responseType: "json",
				data: MIT.createFormData(blob, true)
			})).response.task_id;
		} catch (error) {
			helper.log.error(error);
			throw new Error(helper.t("translation.tip.upload_error"), { cause: error });
		}
	}
	/** 旧版 API：等待翻译完成 */
	async oldWork(blob) {
		const task_id = await this.oldUpload(blob);
		let errorNum = 0;
		let taskState;
		while (!taskState?.finished) try {
			await helper.sleep(200);
			taskState = (await api(\`/task-state?taskid=\${task_id}\`, { responseType: "json" })).response;
			this.setMessage(helper.t(\`translation.status.\${taskState.state}\`) || taskState.state);
		} catch (error) {
			helper.log.error(error);
			if (errorNum > 5) throw new Error(helper.t("translation.tip.check_img_status_failed"), { cause: error });
			errorNum += 1;
		}
		const res = await this.download(\`\${apiUrl()}/result/\${task_id}\`, { headers: headers$1() });
		return URL.createObjectURL(res);
	}
	/** 新版 API：通过流式接口上传 */
	async uploadByStream(blob) {
		const res = await fetch(\`\${apiUrl()}/translate/with-form/image/stream\`, {
			method: "POST",
			headers: headers$1(),
			body: MIT.createFormData(blob, false)
		});
		if (res.status !== 200 || !res.body) throw new Error(helper.t("translation.status.error"));
		return res.body.getReader();
	}
	/** 解析流式响应，等待翻译完成 */
	async wait(reader) {
		const decoder = new TextDecoder("utf-8");
		let buffer = /* @__PURE__ */ new Uint8Array();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer = Uint8Array.from([...buffer, ...value]);
			while (buffer.length >= 5) {
				const totalSize = 5 + new DataView(buffer.buffer).getUint32(1, false);
				if (buffer.length < totalSize) break;
				const data = buffer.slice(5, totalSize);
				switch (buffer[0]) {
					case 0: return URL.createObjectURL(new Blob([data], { type: "image/png" }));
					case 1: {
						const status = decoder.decode(data);
						if (!status.includes(":")) this.setMessage(helper.t(\`translation.status.\${status}\`) || status);
						break;
					}
					case 2: throw new Error(\`\${helper.t("translation.status.error")}: \${decoder.decode(data)}\`);
					case 3: {
						const pos = decoder.decode(data);
						if (pos !== "0") {
							this.setMessage(helper.t("translation.tip.pending", { pos }));
							break;
						}
					}
					case 4: this.setMessage(helper.t("translation.status.pending"));
				}
				buffer = buffer.slice(totalSize);
			}
		}
		throw new Error(helper.t("translation.status.error"));
	}
	/** 新版 API：非流式接口（当流式接口不可用时降级使用） */
	async uploadByNoStream(blob) {
		this.setMessage(helper.t("translation.tip.translating"));
		const res = await api("/translate/with-form/image", {
			method: "POST",
			responseType: "blob",
			fetch: false,
			timeout: 6e5,
			data: MIT.createFormData(blob, false),
			errorText: helper.t("translation.tip.upload_error")
		});
		return URL.createObjectURL(res.response);
	}
	async work(blob) {
		this.setMessage(helper.t("translation.tip.upload"));
		if (this.isOldVersion) return await this.oldWork(blob);
		try {
			const reader = await this.uploadByStream(blob);
			return await this.wait(reader);
		} catch (error) {
			if (error.message.includes("Failed to fetch")) return await this.uploadByNoStream(blob);
			throw error;
		}
	}
};
/** 服务支持的翻译器列表 */
const [mitTranslators, setMitTranslators] = helper.createEqualsSignal([]);
/** 从服务器获取可用翻译器列表 */
const updateMitTranslators = async (noTip = false) => {
	if (!store.option.translation.enabled) return;
	if (store.option.translation.provider !== "manga-image-translator") return;
	try {
		const res = await api("/", {
			noTip,
			errorText: \`\${helper.t("setting.option.paragraph_translation")} - \${helper.t("alert.server_connect_failed")}\`
		});
		const translatorsText = /(?<=validTranslators: )\\[.+?\\](?=,)/su.exec(res.responseText)?.[0];
		if (!translatorsText) return;
		const list = JSON.parse(translatorsText.replaceAll(/\\s|,\\s*(?=\\])/gu, \`\`).replaceAll(\`'\`, \`"\`));
		setMitTranslators(list.map((name) => [name, helper.t(\`translation.translator.\${name}\`) || name]));
	} catch (error) {
		helper.log.error(helper.t("translation.tip.get_translator_list_error"), error);
		setMitTranslators([]);
	}
	if (!mitTranslators().some(([val]) => val === store.option.translation.mit.translator.translator)) {
		const translator = mitTranslators()[0]?.[0];
		setOption("translation", "mit", "translator", "translator", translator);
	}
};
helper.createEffectOn([
	() => store.option.translation.enabled,
	() => store.option.translation.provider,
	() => store.option.translation.mit.localUrl,
	helper.lang
], ([enabled, server]) => enabled && server === "manga-image-translator" && store.imgList.length > 0 && updateMitTranslators(true), { defer: true });
//#endregion
//#region src/components/Manga/index.module.css
const classes$2 = {
	"img": "img___7ajV4",
	"show": "show___HzwUa",
	"mangaFlow": "mangaFlow___jMZgq",
	"mangaBox": "mangaBox___48Jek",
	"root": "root___Hf5H2",
	"pageTip": "pageTip___P7thU",
	"endPage": "endPage___iOZmk",
	"endPageBody": "endPageBody___g-dz-",
	"tip": "tip___fyxqg",
	"jello": "jello___wXBLg",
	"comments": "comments___9ITQv",
	"toolbar": "toolbar___RMjHL",
	"toolbarPanel": "toolbarPanel___XYjgc",
	"toolbarBg": "toolbarBg___i4oTA",
	"SettingPanelPopper": "SettingPanelPopper___uEBz3",
	"SettingPanel": "SettingPanel___ZRvFB",
	"SettingBlock": "SettingBlock___qxNyt",
	"SettingBlockBody": "SettingBlockBody___Wirnd",
	"SettingBlockSubtitle": "SettingBlockSubtitle___cv0Ji",
	"SettingsItem": "SettingsItem___aJhRD",
	"SettingsShowItem": "SettingsShowItem___l-D2E",
	"SettingsItemName": "SettingsItemName___UP6zJ",
	"SettingsItemSwitch": "SettingsItemSwitch___LVGr9",
	"SettingsItemSwitchRound": "SettingsItemSwitchRound___Ds0B8",
	"SettingsItemIconButton": "SettingsItemIconButton___Cs7BQ",
	"SettingsItemSelect": "SettingsItemSelect___CvFKx",
	"closeCover": "closeCover___qLIp5",
	"SettingsShowItemBody": "SettingsShowItemBody___bgxxq",
	"hotkeys": "hotkeys___uu-Xe",
	"hotkeysItem": "hotkeysItem___d9IKS",
	"hotkeysHeader": "hotkeysHeader___jU7vr",
	"scrollbar": "scrollbar___hLToV",
	"scrollbarPage": "scrollbarPage___qghUs",
	"scrollbarSlider": "scrollbarSlider___r1fWf",
	"scrollbarPoper": "scrollbarPoper___XK5Rk",
	"touchAreaRoot": "touchAreaRoot___UN-W1",
	"touchArea": "touchArea___F6Hkh",
	"hidden": "hidden___rxU-6",
	"invisible": "invisible___cO-hs",
	"beautifyScrollbar": "beautifyScrollbar___lb6kJ"
};
//#endregion
//#region src/components/Manga/components/SettingsItem.tsx
var _tmpl$$44 = /*#__PURE__*/ solid_js_web.template(\`<div><div> <!> \`);
/** 设置菜单项 */
const SettingsItem = (props) => (() => {
	var _el$ = _tmpl$$44(), _el$2 = _el$.firstChild, _el$5 = _el$2.firstChild.nextSibling;
	_el$5.nextSibling;
	solid_js_web.insert(_el$2, () => props.name, _el$5);
	solid_js_web.insert(_el$, () => props.children, null);
	solid_js_web.effect((_p$) => {
		var _v$ = props.class ? \`\${classes$2.SettingsItem} \${props.class}\` : classes$2.SettingsItem, _v$2 = {
			[props.class ?? ""]: Boolean(props.class?.length),
			...props.classList
		}, _v$3 = props.style, _v$4 = helper.boolDataVal(props.disabled), _v$5 = classes$2.SettingsItemName;
		_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
		_p$.t = solid_js_web.classList(_el$, _v$2, _p$.t);
		_p$.a = solid_js_web.style(_el$, _v$3, _p$.a);
		_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-disabled", _p$.o = _v$4);
		_v$5 !== _p$.i && solid_js_web.className(_el$2, _p$.i = _v$5);
		return _p$;
	}, {
		e: void 0,
		t: void 0,
		a: void 0,
		o: void 0,
		i: void 0
	});
	return _el$;
})();
//#endregion
//#region src/components/Manga/components/SettingsItemSelect.tsx
var _tmpl$$43 = /*#__PURE__*/ solid_js_web.template(\`<select>\`);
var _tmpl$2$9 = /*#__PURE__*/ solid_js_web.template(\`<option>\`);
/** 选择器式菜单项 */
const SettingsItemSelect = (props) => {
	let ref;
	solid_js.createEffect(() => {
		ref.value = props.options?.some(([val]) => val === props.value) ? props.value : "";
	});
	return solid_js_web.createComponent(SettingsItem, {
		get name() {
			return props.name;
		},
		get ["class"]() {
			return props.class;
		},
		get classList() {
			return props.classList;
		},
		get children() {
			var _el$ = _tmpl$$43();
			solid_js_web.addEventListener(_el$, "click", () => props.onClick?.());
			_el$.addEventListener("change", (e) => props.onChange(e.target.value));
			var _ref$ = ref;
			typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$) : ref = _el$;
			solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js.For, {
				get each() {
					return props.options;
				},
				children: ([val, label]) => (() => {
					var _el$2 = _tmpl$2$9();
					_el$2.value = val;
					solid_js_web.insert(_el$2, label ?? val);
					return _el$2;
				})()
			}));
			solid_js_web.effect(() => solid_js_web.className(_el$, classes$2.SettingsItemSelect));
			return _el$;
		}
	});
};
//#endregion
//#region src/components/Manga/actions/translation/translator/Cotrans/settings.tsx
var _tmpl$$42 = /*#__PURE__*/ solid_js_web.template(\`<blockquote>\`);
const bindOption$3 = (...args) => bindOption("translation", "cotrans", ...args);
/** Cotrans 设置组件 */
const cotransSettings = () => [
	(() => {
		var _el$ = _tmpl$$42();
		solid_js_web.effect(() => _el$.innerHTML = helper.t("setting.translation.cotrans_tip"));
		return _el$;
	})(),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.target_language");
		},
		options: targetLanguageOptions
	}, () => bindOption$3("translator", "target_lang"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.translator");
		},
		get options() {
			return cotransTranslators.map((name) => [name, helper.t(\`translation.translator.\${name}\`) || name]);
		}
	}, () => bindOption$3("translator", "translator"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.direction");
		},
		get options() {
			return [
				["auto", helper.t("setting.translation.options.direction_auto")],
				["horizontal", helper.t("setting.translation.options.direction_horizontal")],
				["vertical", helper.t("setting.translation.options.direction_vertical")]
			];
		}
	}, () => bindOption$3("render", "direction"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.detection_resolution");
		},
		options: [
			["1024", "1024px"],
			["1536", "1536px"],
			["2048", "2048px"],
			["2560", "2560px"]
		]
	}, () => bindOption$3("detector", "detection_size"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.text_detector");
		},
		options: [["default"], ["ctd", "Comic Text Detector"]]
	}, () => bindOption$3("detector", "detector")))
];
//#endregion
//#region src/components/NumberInput.tsx
var _tmpl$$41 = /*#__PURE__*/ solid_js_web.template(\`<span contenteditable data-only-number>\`);
/** 数值输入框 */
const NumberInput = (props) => {
	const handleInput = (e) => {
		const target = e.currentTarget;
		if (props.maxLength === void 0 || target.textContent.length <= props.maxLength) return;
		target.textContent = target.textContent.slice(0, props.maxLength);
		target.blur();
	};
	const handleKeyDown = (e) => {
		switch (e.key) {
			case "ArrowUp": return props.onChange((Number(e.target.textContent) * 1e3 + (props.step ?? 1) * 1e3) / 1e3);
			case "ArrowDown": return props.onChange((Number(e.target.textContent) * 1e3 - (props.step ?? 1) * 1e3) / 1e3);
			case "Enter": return e.target.blur();
		}
	};
	return [(() => {
		var _el$ = _tmpl$$41();
		_el$.addEventListener("blur", (e) => {
			try {
				props.onChange(Number(e.currentTarget.textContent) || 0);
			} finally {
				e.currentTarget.textContent = \`\${props.value}\`;
			}
		});
		solid_js_web.addEventListener(_el$, "keydown", handleKeyDown);
		solid_js_web.addEventListener(_el$, "input", handleInput);
		solid_js_web.insert(_el$, () => \`\${props.value}\`);
		return _el$;
	})(), solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return props.suffix;
		},
		get children() {
			return props.suffix;
		}
	})];
};
//#endregion
//#region src/components/Manga/components/SettingsItemNumber.tsx
var _tmpl$$40 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
/** 数值输入框菜单项 */
const SettingsItemNumber = (props) => solid_js_web.createComponent(SettingsItem, {
	get name() {
		return props.name;
	},
	get ["class"]() {
		return props.class;
	},
	get classList() {
		return props.classList;
	},
	get children() {
		var _el$ = _tmpl$$40();
		solid_js_web.insert(_el$, solid_js_web.createComponent(NumberInput, props));
		solid_js_web.effect((_$p) => solid_js_web.setStyleProperty(_el$, "margin-right", props.suffix ? ".3em" : ".6em"));
		return _el$;
	}
});
//#endregion
//#region src/components/Manga/components/SettingsItemSwitch.tsx
var _tmpl$$39 = /*#__PURE__*/ solid_js_web.template(\`<button type=button><div>\`);
/** 开关式菜单项 */
const SettingsItemSwitch = (props) => {
	const handleClick = () => props.onChange(!props.value);
	return solid_js_web.createComponent(SettingsItem, {
		get name() {
			return props.name;
		},
		get ["class"]() {
			return props.class;
		},
		get classList() {
			return props.classList;
		},
		get disabled() {
			return props.disabled;
		},
		get children() {
			var _el$ = _tmpl$$39(), _el$2 = _el$.firstChild;
			solid_js_web.addEventListener(_el$, "click", handleClick);
			solid_js_web.effect((_p$) => {
				var _v$ = classes$2.SettingsItemSwitch, _v$2 = props.value, _v$3 = classes$2.SettingsItemSwitchRound;
				_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
				_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-checked", _p$.t = _v$2);
				_v$3 !== _p$.a && solid_js_web.className(_el$2, _p$.a = _v$3);
				return _p$;
			}, {
				e: void 0,
				t: void 0,
				a: void 0
			});
			return _el$;
		}
	});
};
//#endregion
//#region src/components/Manga/actions/translation/translator/MangaImageTranslator/settings.tsx
/**
* MangaImageTranslator 翻译服务设置界面
*/
var _tmpl$$38 = /*#__PURE__*/ solid_js_web.template(\`<input type=url>\`);
const bindOption$2 = (...args) => bindOption("translation", "mit", ...args);
/** MangaImageTranslator 设置组件 */
const mitSettings = () => [
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.target_language");
		},
		options: targetLanguageOptions
	}, () => bindOption$2("translator", "target_lang"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.translator");
		},
		get options() {
			return mitTranslators();
		},
		onClick: updateMitTranslators
	}, () => bindOption$2("translator", "translator"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.direction");
		},
		get options() {
			return [
				["auto", helper.t("setting.translation.options.direction_auto")],
				["horizontal", helper.t("setting.translation.options.direction_horizontal")],
				["vertical", helper.t("setting.translation.options.direction_vertical")]
			];
		}
	}, () => bindOption$2("render", "direction"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.detection_resolution");
		},
		options: [
			["1024", "1024px"],
			["1536", "1536px"],
			["2048", "2048px"],
			["2560", "2560px"]
		]
	}, () => bindOption$2("detector", "detection_size"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.text_detector");
		},
		options: [["default"], ["ctd", "Comic Text Detector"]]
	}, () => bindOption$2("detector", "detector"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.inpainting_size");
		},
		options: [
			["516", "516px"],
			["1024", "1024px"],
			["2048", "2048px"],
			["2560", "2560px"]
		]
	}, () => bindOption$2("inpainter", "inpainting_size"))),
	solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.inpainter");
		},
		options: [
			["default", "Default"],
			["lama_large", "Lama Large"],
			["lama_mpe", "Lama MPE"],
			["sd", "SD"],
			["none", "None"],
			["original", "Original"]
		]
	}, () => bindOption$2("inpainter", "inpainter"))),
	solid_js_web.createComponent(SettingsItemNumber, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.unclip_ratio");
		},
		step: .01
	}, () => bindOption$2("detector", "unclip_ratio"))),
	solid_js_web.createComponent(SettingsItemNumber, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.translation.options.box_threshold");
		},
		step: .01
	}, () => bindOption$2("detector", "box_threshold"))),
	solid_js_web.createComponent(SettingsItemNumber, solid_js_web.mergeProps({ get name() {
		return helper.t("setting.translation.options.mask_dilation_offset");
	} }, () => bindOption$2("mask_dilation_offset"))),
	solid_js_web.createComponent(SettingsItemSwitch, {
		get name() {
			return helper.t("setting.translation.options.local_url");
		},
		get value() {
			return store.option.translation.mit.localUrl !== void 0;
		},
		onChange: (val) => {
			setOption("translation", "mit", "localUrl", val ? "" : void 0);
		}
	}),
	solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return store.option.translation.mit.localUrl !== void 0;
		},
		get children() {
			var _el$ = _tmpl$$38();
			_el$.addEventListener("change", (e) => {
				const url = e.target.value.replace(/\\/$/u, "");
				setOption("translation", "mit", "localUrl", url);
			});
			solid_js_web.effect(() => _el$.value = store.option.translation.mit.localUrl);
			return _el$;
		}
	})
];
//#endregion
//#region src/components/Manga/actions/translation/index.ts
/** 判断当前翻译器是否允许批量翻译 */
const allowBatchTranslation = () => store.option.translation.provider !== "cotrans";
const taskRegistry = {
	"manga-image-translator": MIT,
	cotrans: Cotrans
};
const setMessage = (url, message) => setState("imgMap", url, "translationMessage", message);
/** 翻译指定图片 */
const translationImage = async (url) => {
	try {
		if (!url) return;
		const img = store.imgMap[url];
		if (img.translationType !== "wait") return;
		if (img.translationUrl) return setState("imgMap", url, "translationType", "show");
		if (img.loadType !== "loaded") return setMessage(url, helper.t("translation.tip.img_not_fully_loaded"));
		const Task = taskRegistry[store.option.translation.provider];
		if (!Task) throw new Error("未知翻译器");
		const translationUrl = await new Task(url).run();
		setState("imgMap", url, {
			translationUrl,
			translationMessage: helper.t("translation.tip.translation_completed"),
			translationType: "show"
		});
	} catch (error) {
		setState("imgMap", url, "translationType", "error");
		if (error?.message) setState("imgMap", url, "translationMessage", error.message);
	}
};
/** 逐个翻译状态为等待翻译的图片 */
const translationAll = helper.singleThreaded(async (state) => {
	if (!store.option.translation.enabled) return;
	const targetImg = imgList().find((img) => img.translationType === "wait" && img.loadType === "loaded");
	if (!targetImg) return;
	await translationImage(targetImg.src);
	state.continueRun();
});
/** 开启或关闭指定图片的翻译 */
const setImgTranslationEnbale = (list, enable) => {
	if (!store.option.translation.enabled && enable) return;
	setState((state) => {
		for (const i of list) {
			const img = state.imgMap[state.imgList[i]];
			if (!img) continue;
			const url = img.src;
			if (enable) {
				if (state.option.translation.forceRetry) {
					img.translationType = "wait";
					img.translationUrl = void 0;
					setMessage(url, helper.t("translation.tip.wait_translation"));
				} else switch (img.translationType) {
					case "hide":
						img.translationType = "show";
						break;
					case "error":
					case void 0:
						img.translationType = "wait";
						setMessage(url, helper.t("translation.tip.wait_translation"));
				}
			} else switch (img.translationType) {
				case "show":
					img.translationType = "hide";
					break;
				case "error":
				case "wait": img.translationType = void 0;
			}
		}
	});
	return translationAll();
};
/** 翻译范围的图片 */
const translationImgs = helper.createRootMemo(() => {
	const list = /* @__PURE__ */ new Set();
	for (const [i, img] of imgList().entries()) switch (img.translationType) {
		case "error":
		case "show":
		case "wait": list.add(i);
	}
	return list;
});
/** 当前显示的图片是否正在翻译 */
const isTranslatingImage = helper.createRootMemo(() => activePage().some((i) => translationImgs().has(i)));
/** 翻译当前页 */
const translateCurrent = () => setImgTranslationEnbale(activePage(), !isTranslatingImage());
const createTranslateRange = (imgs) => {
	const isTranslating = helper.createRootMemo(() => imgs().every((i) => translationImgs().has(i)));
	const translateRange = () => {
		if (!allowBatchTranslation()) return;
		setImgTranslationEnbale(imgs(), !isTranslating());
	};
	return [isTranslating, translateRange];
};
const [isTranslatingAll, translateAll] = createTranslateRange(helper.createRootMemo(() => helper.range(store.imgList.length)));
const [isTranslatingToEnd, translateToEnd] = createTranslateRange(helper.createRootMemo(() => helper.range(activeImgIndex(), store.imgList.length)));
//#endregion
//#region src/components/Manga/actions/imageLoad/reactor.ts
/** 重新加载错误图片 */
const reloadImg = (url) => {
	if (store.imgMap[url]?.loadType !== "error") return;
	setState("imgMap", url, "loadType", "wait");
	updateImgLoadType();
};
/** 图片加载失败后定时重新加载 */
const handleTimeReload = (url) => {
	const count = loadState.imgErrorMap.get(url) || 0;
	if (count > 8) return;
	loadState.imgErrorMap.set(url, count + 1);
	const time = (2 ** count + Math.random() * 2) * 1e3;
	setTimeout(reloadImg, time, url);
};
/** 图片加载完毕的回调 */
const handleImgLoaded = (url, e) => {
	loadState.imgErrorMap.delete(url);
	const img = store.imgMap[url];
	if (img.translationType === "show") return;
	if (img.loadType !== "loaded") {
		setState("imgMap", url, "loadType", "loaded");
		loadState.unloadedUrlSet.delete(url);
		loadState.loadingUrlSet.delete(url);
		updateImgLoadType();
		store.prop.onLoading?.(imgList(), store.imgMap[url]);
	}
	if (!e) return;
	updateImgSize(url, e.naturalWidth, e.naturalHeight);
	if (store.option.imgRecognition.enabled && e.src === img.blobUrl && isInRenderRange(url)) setTimeout(handleImgRecognition, 0, url, e);
	if (store.option.translation.enabled) translationAll();
};
/** 图片加载出错的回调 */
const handleImgError = (url, e) => {
	if (e && !e.isConnected) return;
	setState((state) => {
		const img = state.imgMap[url];
		if (!img) return;
		helper.log.error(getImgIndexs(url), helper.t("alert.img_load_failed"), e);
		img.loadType = "error";
		img.type = void 0;
	});
	loadState.loadingUrlSet.delete(url);
	handleTimeReload(url);
	store.prop.onLoading?.(imgList(), store.imgMap[url]);
	store.prop.onImgError?.(url);
	updateImgLoadType();
};
helper.createEffectOn(showImgList, helper.debounce((list) => {
	if (loadState.imgErrorMap.size === 0) return;
	for (const i of list) reloadImg(getImg(i).src);
}, 500), { defer: true });
const timeoutAbort = (url) => {
	if (!loadState.abortMap.has(url)) return;
	loadState.abortMap.get(url).abort();
	loadState.abortMap.delete(url);
	handleImgError(url);
};
helper.createEffectOn(() => new Set(loadState.loadingUrlSet), (downImgList, prevImgList) => {
	if (!store.option.imgRecognition.enabled) return;
	if (prevImgList) for (const url of prevImgList) {
		if (downImgList.has(url) || !loadState.abortMap.has(url)) continue;
		loadState.abortMap.get(url)?.abort();
		loadState.abortMap.delete(url);
		helper.log(\`中断下载 \${url}\`);
	}
	for (const url of downImgList) {
		if (loadState.abortMap.has(url) || store.imgMap[url].blobUrl) continue;
		const controller = new AbortController();
		const handleTimeout = helper.debounce(() => timeoutAbort(url), 3e3);
		controller.signal.addEventListener("abort", handleTimeout.clear);
		loadState.abortMap.set(url, controller);
		handleTimeout();
		request.request(url, {
			responseType: "blob",
			retryFetch: true,
			signal: controller.signal,
			timeout: void 0,
			noTip: true,
			headers: request.downloadImgHeaders,
			onerror: () => handleImgError(url),
			onprogress({ loaded, total }) {
				setState("imgMap", url, "progress", loaded / total * 100);
				handleTimeout();
			},
			onload({ response }) {
				loadState.abortMap.delete(url);
				setState("imgMap", url, {
					blobUrl: URL.createObjectURL(response),
					progress: void 0
				});
				handleImgLoaded(url);
			}
		});
	}
});
//#endregion
//#region src/components/Manga/actions/zoom.ts
const touches = /* @__PURE__ */ new Map();
const bound = helper.createMemoMap({
	x: () => -store.rootSize.width * (store.option.zoom.ratio / 100 - 1),
	y: () => -store.rootSize.height * (store.option.zoom.ratio / 100 - 1)
});
const checkBound = (state) => {
	state.option.zoom.offset.x = helper.clamp(bound().x, state.option.zoom.offset.x, 0);
	state.option.zoom.offset.y = helper.clamp(bound().y, state.option.zoom.offset.y, 0);
};
const zoom = (val, focal, animation = false) => {
	const newScale = helper.clamp(100, val, 300);
	if (newScale === store.option.zoom.ratio) return;
	const { left, top } = refs.mangaBox.getBoundingClientRect();
	const x = (focal?.x ?? store.rootSize.width / 2) - left;
	const y = (focal?.y ?? store.rootSize.height / 2) - top;
	const newX = x / (store.option.zoom.ratio / 100) * (newScale / 100);
	const newY = y / (store.option.zoom.ratio / 100) * (newScale / 100);
	const dx = newX - x;
	const dy = newY - y;
	setOption((draftOption, state) => {
		draftOption.zoom.ratio = newScale;
		draftOption.zoom.offset.x -= dx;
		draftOption.zoom.offset.y -= dy;
		checkBound(state);
		if (animation) state.page.anima = "zoom";
	});
};
/** 摩擦系数 */
const FRICTION_COEFF$1 = .91;
/** 逐帧根据鼠标坐标移动元素，并计算速率 */
const zoomDragAnim = new class extends helper.AnimationFrame {
	mouse = {
		x: 0,
		y: 0
	};
	last = {
		x: 0,
		y: 0
	};
	velocity = {
		x: 0,
		y: 0
	};
	frame = () => {
		if (this.mouse.x === store.option.zoom.offset.x && this.mouse.y === store.option.zoom.offset.y) {
			this.animationId = 0;
			return;
		}
		setOption((draftOption, state) => {
			this.last.x = draftOption.zoom.offset.x;
			this.last.y = draftOption.zoom.offset.y;
			draftOption.zoom.offset.x = this.mouse.x;
			draftOption.zoom.offset.y = this.mouse.y;
			checkBound(state);
			this.velocity.x = draftOption.zoom.offset.x - this.last.x;
			this.velocity.y = draftOption.zoom.offset.y - this.last.y;
		});
		this.call(true);
	};
	/** 一段时间没有移动后应该将速率归零 */
	resetVelocity = helper.debounce(() => {
		this.velocity.x = 0;
		this.velocity.y = 0;
	}, 200);
}();
/** 逐帧计算惯性滑动 */
const zoomSlideAnim = new class extends helper.AnimationFrame {
	lastTime = 0;
	frame = (timestamp) => {
		if (helper.approx(zoomDragAnim.velocity.x, 0, 1) && helper.approx(zoomDragAnim.velocity.y, 0, 1)) {
			this.animationId = 0;
			return;
		}
		setOption((draftOption, state) => {
			draftOption.zoom.offset.x += zoomDragAnim.velocity.x;
			draftOption.zoom.offset.y += zoomDragAnim.velocity.y;
			checkBound(state);
			if (timestamp - this.lastTime > 16) {
				zoomDragAnim.velocity.x *= FRICTION_COEFF$1;
				zoomDragAnim.velocity.y *= FRICTION_COEFF$1;
				this.lastTime = timestamp;
			}
		});
		this.call(true);
	};
}();
/** 是否正在双指捏合缩放中 */
let pinchZoom = false;
/** 处理放大后的拖拽移动 */
const handleZoomDrag = ({ type, xy: [x, y], last: [lx, ly] }) => {
	if (store.option.zoom.ratio === 100) return;
	switch (type) {
		case "down":
			zoomDragAnim.velocity.x = 0;
			zoomDragAnim.velocity.y = 0;
			zoomDragAnim.mouse.x = store.option.zoom.offset.x;
			zoomDragAnim.mouse.y = store.option.zoom.offset.y;
			zoomSlideAnim.cancel();
			zoomDragAnim.cancel();
			break;
		case "move":
			zoomDragAnim.cancel();
			zoomDragAnim.mouse.x += x - lx;
			zoomDragAnim.mouse.y += y - ly;
			zoomDragAnim.call();
			zoomDragAnim.resetVelocity();
			break;
		case "up":
			zoomDragAnim.resetVelocity.clear();
			if (pinchZoom) {
				pinchZoom = false;
				zoomDragAnim.mouse.x = store.option.zoom.offset.x;
				zoomDragAnim.mouse.y = store.option.zoom.offset.y;
				return;
			}
			zoomDragAnim.cancel();
			zoomSlideAnim.call();
	}
};
/** 获取两个指针之间的距离 */
const getDistance = (a, b) => Math.hypot(b.xy[0] - a.xy[0], b.xy[1] - a.xy[1]);
/** 逐帧计算当前屏幕上两点之间的距离，并换算成缩放比例 */
const pinchZoomAnim = new class extends helper.AnimationFrame {
	initDistance = 0;
	initScale = 100;
	frame = () => {
		if (touches.size < 2) {
			this.animationId = 0;
			return;
		}
		const [a, b] = [...touches.values()];
		const distance = getDistance(a, b);
		zoom(distance / this.initDistance * this.initScale, {
			x: (a.xy[0] + b.xy[0]) / 2,
			y: (a.xy[1] + b.xy[1]) / 2
		});
		this.call(true);
	};
}();
/** 处理双指捏合缩放 */
const handlePinchZoom = ({ type }) => {
	if (touches.size < 2) return;
	switch (type) {
		case "down": {
			pinchZoom = true;
			const [a, b] = [...touches.values()];
			pinchZoomAnim.initDistance = getDistance(a, b);
			pinchZoomAnim.initScale = store.option.zoom.ratio;
			break;
		}
		case "up": {
			const [a, b] = [...touches.values()];
			pinchZoomAnim.initDistance = getDistance(a, b);
			break;
		}
		case "move":
			pinchZoomAnim.call();
			break;
		case "cancel": {
			const [a, b] = [...touches.values()];
			pinchZoomAnim.initDistance = getDistance(a, b);
			break;
		}
	}
};
//#endregion
//#region src/components/Manga/actions/scroll.ts
const _scrollTo = (top) => {
	const val = helper.clamp(0, top, contentHeight() - store.rootSize.height);
	refs.mangaBox.scrollTo({
		top: val,
		behavior: "instant"
	});
	setState((state) => {
		state.scrollTop = val;
		openScrollLock(state);
	});
};
/** 在卷轴模式下滚动到指定进度 */
const scrollTo = (x, smooth = false) => {
	if (!store.option.scrollMode.enabled) return;
	if (store.option.scrollMode.abreastMode) {
		_scrollTo(0);
		const val = helper.clamp(0, x, abreastScrollWidth());
		return setState("page", "offset", "x", "px", val);
	}
	if (!smooth) {
		scrollStep.cancel();
		return _scrollTo(x);
	}
	if (store.option.scrollDuration <= 0) {
		scrollStep.cancel();
		return _scrollTo(x);
	}
	if (scrollStep.animationId) {
		scrollStep.cancel();
		_scrollTo(x);
	}
	scrollStep.start(x);
};
/** 在卷轴模式下滚动指定进度 */
const scrollBy = (offset, smooth = false) => {
	if (!store.option.scrollMode.enabled) return;
	if (handleEndTurnPage(offset > 0 ? "next" : "prev")) return;
	return scrollTo(scrollTop() + offset, smooth);
};
/** 实现卷轴模式下的平滑滚动 */
const scrollStep = new class extends helper.AnimationFrame {
	/** 动画时长 */
	duration = 0;
	/** 要滚动的距离 */
	distance = 0;
	/** 滚动开始时间 */
	startTime = 0;
	/** 滚动开始位置 */
	startTop = 0;
	scrollTo = (top) => {
		if (helper.inRange(0, top, scrollLength())) scrollTo(top);
		else this.cancel();
	};
	frame = (timestamp) => {
		this.cancel();
		this.startTime ||= timestamp;
		/** 已滚动时间 */
		const elapsed = timestamp - this.startTime;
		if (elapsed >= this.duration) return this.scrollTo(this.startTop + this.distance);
		this.scrollTo(this.startTop + elapsed / this.duration * this.distance);
		this.call(true);
	};
	start = (x) => {
		this.duration = store.option.scrollDuration;
		this.startTime = 0;
		this.startTop = scrollTop();
		this.distance = x - this.startTop;
		this.frame(0);
	};
}();
/** 实现卷轴模式下的匀速滚动 */
const constantScroll = new class extends helper.AnimationFrame {
	speed = 0;
	lastTime = 0;
	onScroll;
	scrollTo = (top) => {
		if (helper.inRange(0, top, scrollLength())) scrollTo(top);
		else this.cancel();
	};
	frame = (timestamp) => {
		if (!this.animationId) return;
		const scrollDelta = this.lastTime ? this.speed * (timestamp - this.lastTime) : 0;
		this.lastTime = timestamp;
		if (this.onScroll?.(scrollDelta) === false) return this.cancel();
		this.scrollTo(scrollTop() + scrollDelta);
		this.call(true);
	};
	start = (speed, onScroll) => {
		if (this.animationId && speed === this.speed && this.onScroll === onScroll) return;
		this.cancel();
		this.speed = speed;
		this.onScroll = onScroll;
		this.lastTime = 0;
		this.call();
	};
}();
/** 保存当前滚动进度，并在之后恢复 */
const saveScrollProgress = () => {
	const oldScrollPercentage = scrollPercentage();
	return () => scrollTo(oldScrollPercentage * scrollLength());
};
/** 在卷轴模式下，滚动到能显示指定图片的位置 */
const scrollViewImg = (i) => {
	if (!store.option.scrollMode.enabled) return;
	let top;
	if (store.option.scrollMode.abreastMode) top = abreastArea().columns.findIndex((column) => column.includes(i)) * abreastColumnWidth() + 1;
	else top = pageTopList()[i] + 1;
	scrollTo(top);
};
/** 跳转到指定图片的显示位置 */
const jumpToImg = (index) => {
	zoom(100);
	if (store.option.scrollMode.enabled) return scrollViewImg(index);
	const pageNum = imgPageMap()[index];
	if (pageNum === void 0) return;
	setState("activePageIndex", pageNum);
};
//#endregion
//#region src/components/Manga/actions/switch.ts
/** 切换页面填充 */
const switchFillEffect = () => {
	setState((state) => {
		if (state.pageList[state.activePageIndex].length !== 2) return;
		state.fillEffect[nowFillIndex()] = Number(!state.fillEffect[nowFillIndex()]);
		updatePageData(state);
	});
};
/** 切换卷轴模式 */
const switchScrollMode = () => {
	const index = activeImgIndex();
	zoom(100);
	setOption((draftOption, state) => {
		draftOption.scrollMode.enabled = !draftOption.scrollMode.enabled;
		state.page.offset.x.px = 0;
		state.page.offset.y.px = 0;
	});
	jumpToImg(index);
};
/** 切换单双页模式 */
const switchOnePageMode = () => {
	const index = activeImgIndex();
	setOption((draftOption, state) => {
		if (draftOption.scrollMode.enabled) {
			if (draftOption.scrollMode.abreastMode) {
				draftOption.scrollMode.abreastMode = false;
				draftOption.scrollMode.doubleMode = true;
			} else draftOption.scrollMode.doubleMode = !draftOption.scrollMode.doubleMode;
		} else {
			const newPageNum = pageNum() === 1 ? 2 : 1;
			draftOption.pageNum = state.option.autoSwitchPageMode && newPageNum === autoPageNum() ? 0 : newPageNum;
		}
	});
	jumpToImg(index);
};
/** 切换阅读方向 */
const switchDir = () => setOption("dir", store.option.dir === "rtl" ? "ltr" : "rtl");
/** 切换全屏 */
const switchFullscreen = () => {
	if (document.fullscreenElement) return document.exitFullscreen();
	return refs.root.requestFullscreen();
};
/** 切换自动滚动 */
const switchAutoScroll = () => setState("autoScroll", "play", (val) => !val);
/** 停止自动滚动 */
const stopAutoScroll = () => {
	if (!store.autoScroll.play) return;
	setState("autoScroll", "play", false);
	constantScroll.cancel();
};
/** 切换图片识别相关功能 */
const switchImgRecognition = (...path) => {
	const onlyUpscale = path.length === 1 && path[0] === "upscale";
	setOption((draftOption, state) => {
		const option = draftOption.imgRecognition;
		if (path.length === 0) path.push("enabled");
		for (const key of path) option[key] = !option[key];
		if (!option.enabled) return syncImgLoadState(state);
		for (const img of Object.values(state.imgMap)) if (!img.blobUrl) img.loadType = "wait";
		syncImgLoadState(state);
		if (path.includes("enabled")) updateImgLoadType();
	});
	if (!onlyUpscale) invalidateRecognition();
};
//#endregion
//#region src/components/Manga/actions/show.ts
/** 将页面移回原位 */
const resetPage = (state, animation = false) => {
	updateShowRange(state);
	state.page.offset.x.pct = 0;
	state.page.offset.y.pct = 0;
	if (state.option.scrollMode.enabled) {
		state.page.anima = "";
		return;
	}
	let i = -1;
	if (helper.inRange(state.renderRange[0], state.activePageIndex, state.renderRange[1])) i = state.activePageIndex - state.renderRange[0];
	if (store.page.vertical) state.page.offset.y.pct = i === -1 ? 0 : -i;
	else state.page.offset.x.pct = i === -1 ? 0 : i;
	state.page.anima = animation ? "page" : "";
};
/** 获取指定图片的提示文本 */
const getImgTip = (i) => {
	if (i === -1) return helper.t("other.fill_page");
	const img = getImg(i);
	if (img.loadType !== "loaded") return \`\${i + 1} (\${helper.t(\`img_status.\${img.loadType}\`)})\`;
	if (img.translationType && img.translationType !== "hide" && img.translationMessage) return \`\${i + 1}：\${img.translationMessage}\`;
	if (isUpscale() && img.upscaleUrl !== void 0) return \`\${i + 1} (\${img.upscaleUrl ? helper.t("upscale.upscaled") : helper.t("upscale.upscaling")})\`;
	return \`\${i + 1}\`;
};
/** 获取指定页面的提示文本 */
const getPageTip = (pageIndex) => {
	const page = store.pageList[pageIndex];
	if (!page) return "null";
	const pageIndexText = page.map((index) => index === -1 ? helper.t("other.fill_page") : \`\${index + 1}\`);
	if (pageIndexText.length === 1) return pageIndexText[0];
	if (store.option.dir === "rtl") pageIndexText.reverse();
	return pageIndexText.join(" | ");
};
helper.createEffectOn(() => store.activePageIndex, () => store.show.endPage && setState("show", "endPage", void 0), { defer: true });
helper.createEffectOn(activePage, helper.throttle(() => store.isDragMode || store.isTurnAnimating || setState(resetPage)));
helper.createEffectOn(() => store.show.toolbar, () => {
	if (store.show.toolbar) return;
	setState((state) => {
		state.show.scrollbar = false;
		state.show.pageTip = false;
	});
}, { defer: true });
//#endregion
//#region src/components/Manga/actions/readProgress.ts
let cache = void 0;
const initCache = async () => {
	cache ||= await helper.useCache({ progress: "id" }, "ReadProgress");
};
let lastIndex = -1;
/** 保存阅读进度 */
const saveReadProgress = helper.throttle(async () => {
	await initCache();
	const index = activeImgIndex();
	if (index === lastIndex) return;
	lastIndex = index;
	if (store.imgList.length < 50 || index >= store.imgList.length - 5) return await cache.del("progress", location.pathname);
	const imgSize = {};
	for (const [i, img] of imgList().entries()) if (img.width && img.height) imgSize[i] = [img.width, img.height];
	await cache.set("progress", {
		id: location.pathname,
		time: Date.now(),
		index,
		imgSize,
		fillEffect: solid_js_store.unwrap(store.fillEffect)
	});
}, 1e3);
/** 恢复阅读进度 */
const resumeReadProgress = async (state) => {
	await initCache();
	const progress = await cache.get("progress", location.pathname);
	if (!progress) return;
	let i = state.imgList.length;
	while (i--) {
		const imgSize = progress.imgSize[i];
		if (imgSize) updateImgSize(state.imgList[i], ...imgSize, state);
	}
	state.fillEffect = progress.fillEffect;
	updatePageData(state);
	if (state.option.scrollMode.enabled) setTimeout(scrollViewImg, 500, progress.index);
	else jumpToImg(progress.index);
	const nowTime = Date.now();
	cache.each("progress", async (data, cursor) => {
		if (nowTime - data.time < 25056e5) return;
		await helper.promisifyRequest(cursor.delete());
	});
};
//#endregion
//#region src/components/Manga/actions/turnPage.ts
/** 翻页。返回是否成功改变了当前页数 */
const turnPage = withOptionalState((dir, state) => {
	if (state.option.scrollMode.enabled) return false;
	if (handleEndTurnPage(dir, state)) return false;
	saveReadProgress();
	state.activePageIndex += dir === "next" ? 1 : -1;
	return true;
});
/** 判断翻页方向 */
const getTurnPageDir = (move, total, startTime) => {
	let dir;
	if (!startTime) {
		if (Math.abs(move) > total / 2) dir = move > 0 ? "next" : "prev";
		return dir;
	}
	if (Math.abs(move) > total / 3) dir = move > 0 ? "next" : "prev";
	if (dir) return dir;
	const velocity = move / (performance.now() - startTime);
	if (velocity < -.4) dir = "prev";
	if (velocity > .4) dir = "next";
	return dir;
};
//#endregion
//#region src/components/Manga/actions/turnPageAnimator.ts
/** 拖动松手翻页动画时长（固定） */
const DRAG_TURN_ANIMATION_DURATION = 100;
/** 缓动函数：先慢后快再慢 */
const easeInOutCubic = (t) => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
/** 将 mangaFlow 偏移到指定页在 renderRange 中的位置 */
const setOffsetToPage = (state, pageIndex) => {
	const i = pageIndex - state.renderRange[0];
	state.page.offset.x.pct = state.page.vertical ? 0 : i;
	state.page.offset.y.pct = state.page.vertical ? -i : 0;
	state.page.offset.x.px = 0;
	state.page.offset.y.px = 0;
};
/** 计算翻页动画的起点偏移（像素） */
const getTurnStartOffsets = ({ state, oldIndex, oldRenderRange, oldOffset }) => {
	const [rangeStart, rangeEnd] = state.renderRange;
	const startIndex = helper.clamp(oldIndex, rangeStart, rangeEnd);
	if (oldIndex >= rangeStart && oldIndex <= rangeEnd) {
		const size = state.page.vertical ? state.rootSize.height : state.rootSize.width;
		const oldInternal = state.page.vertical ? oldOffset.y.pct * size + oldOffset.y.px : oldOffset.x.pct * size + oldOffset.x.px;
		const oldAbs = oldRenderRange[0] + (state.page.vertical ? -oldInternal / size : oldInternal / size);
		const startInternal = state.page.vertical ? helper.clamp(-(oldAbs - rangeStart) * size, -(rangeEnd - rangeStart) * size, 0) : helper.clamp((oldAbs - rangeStart) * size, 0, (rangeEnd - rangeStart) * size);
		return {
			x: state.page.vertical ? 0 : startInternal,
			y: state.page.vertical ? startInternal : 0
		};
	}
	setOffsetToPage(state, startIndex);
	return {
		x: state.page.offset.x.pct * state.rootSize.width + state.page.offset.x.px,
		y: state.page.offset.y.pct * state.rootSize.height + state.page.offset.y.px
	};
};
const turnPageAnimator = new class extends helper.AnimationFrame {
	/** 动画令牌，用于丢弃失效的帧回调 */
	token = 0;
	/** 本次动画时长 */
	duration = 0;
	/** 本次动画开始时间 */
	startTime = 0;
	/** 起点偏移（像素） */
	from = {
		x: 0,
		y: 0
	};
	/** 终点偏移（像素） */
	to = {
		x: 0,
		y: 0
	};
	/** 终点页对应的 pct，动画期间保持该值不变 */
	toPct = {
		x: 0,
		y: 0
	};
	frame = (timestamp) => {
		const { token } = this;
		if (this.startTime === 0) this.startTime = timestamp;
		const elapsed = timestamp - this.startTime;
		const progress = Math.min(1, elapsed / this.duration);
		const t = easeInOutCubic(progress);
		const x = this.from.x + (this.to.x - this.from.x) * t;
		const y = this.from.y + (this.to.y - this.from.y) * t;
		setState((state) => {
			if (token !== this.token) return;
			state.page.offset.x.pct = this.toPct.x;
			state.page.offset.y.pct = this.toPct.y;
			state.page.offset.x.px = x - this.toPct.x * state.rootSize.width;
			state.page.offset.y.px = y - this.toPct.y * state.rootSize.height;
		});
		if (progress >= 1) {
			this.finish();
			return;
		}
		if (token === this.token) this.call(true);
	};
	start = (dir, duration = store.option.turnPageDuration) => {
		if (store.option.scrollMode.enabled) {
			turnPage(dir);
			return;
		}
		if (duration <= 0) {
			this.turnDirectly(dir);
			return;
		}
		if (store.isTurnAnimating) this.finish();
		this.cancel();
		this.token += 1;
		if (!this.prepareTurn(dir)) return;
		this.duration = duration;
		this.startTime = 0;
		this.call();
	};
	/** 直接翻页 */
	turnDirectly = (dir) => {
		this.cancel();
		this.token += 1;
		setState((state) => {
			if (state.option.scrollMode.enabled) return turnPage(dir, state);
			if (!turnPage(dir, state)) {
				state.isTurnAnimating = false;
				state.isDragMode = false;
				resetPage(state, true);
				state.page.offset.x.px = 0;
				state.page.offset.y.px = 0;
				return;
			}
			state.isTurnAnimating = false;
			state.isDragMode = false;
			state.page.offset.x.px = 0;
			state.page.offset.y.px = 0;
			resetPage(state, false);
		});
	};
	/** 准备一次动画：翻页并计算起点/终点偏移。返回是否成功 */
	prepareTurn = (dir) => {
		let success = false;
		setState((state) => {
			if (state.option.scrollMode.enabled) {
				turnPage(dir, state);
				return;
			}
			const oldIndex = state.activePageIndex;
			if (!turnPage(dir, state)) {
				state.isTurnAnimating = false;
				state.isDragMode = false;
				resetPage(state, true);
				state.page.offset.x.px = 0;
				state.page.offset.y.px = 0;
				return;
			}
			success = true;
			const oldRenderRange = state.renderRange;
			const oldOffset = {
				x: {
					pct: state.page.offset.x.pct,
					px: state.page.offset.x.px
				},
				y: {
					pct: state.page.offset.y.pct,
					px: state.page.offset.y.px
				}
			};
			resetPage(state);
			const toX = state.page.offset.x.pct;
			const toY = state.page.offset.y.pct;
			const { x: startX, y: startY } = getTurnStartOffsets({
				state,
				oldIndex,
				oldRenderRange,
				oldOffset
			});
			this.from.x = startX;
			this.from.y = startY;
			this.to.x = toX * state.rootSize.width;
			this.to.y = toY * state.rootSize.height;
			this.toPct.x = toX;
			this.toPct.y = toY;
			state.page.offset.x.pct = toX;
			state.page.offset.y.pct = toY;
			state.page.offset.x.px = startX - toX * state.rootSize.width;
			state.page.offset.y.px = startY - toY * state.rootSize.height;
			state.page.anima = "";
			state.isDragMode = false;
			state.isTurnAnimating = true;
		});
		return success;
	};
	finish = () => {
		this.cancel();
		this.token += 1;
		setState((state) => {
			state.isTurnAnimating = false;
			state.isDragMode = false;
			state.page.offset.x.px = 0;
			state.page.offset.y.px = 0;
			if (state.option.zoom.ratio === 100) resetPage(state, false);
			else state.page.anima = "";
		});
	};
	stop = () => {
		this.cancel();
		this.token += 1;
		if (store.isTurnAnimating) setState((state) => {
			state.isTurnAnimating = false;
			state.page.anima = "";
		});
	};
}();
/** 带滑动动画的翻页。连续翻页会先直接走完上一次动画，再从当前目标页开始新动画 */
const turnPageAnimation = (dir, duration) => turnPageAnimator.start(dir, duration);
/** 取消当前正在播放的翻页滑动动画 */
const cancelTurnAnimation = () => turnPageAnimator.stop();
/** 直接走完当前正在播放的翻页滑动动画 */
const finishTurnAnimation = () => store.isTurnAnimating && turnPageAnimator.finish();
//#endregion
//#region src/components/Manga/actions/hotkeyAction.ts
/** 卷轴模式下滚动至指定页数 */
const scrollIntoView = (index, position = "start") => scrollTo(position === "start" ? getPageTop(index) : getPageTop(index + 1) - store.rootSize.height, true);
/** 判断指定页能否被完全显示出来 */
const isFullView = (i) => pageHeightList()[i] < store.rootSize.height;
/** 在卷轴模式下，智能滚动至图片的头尾 */
const scrollViewTurnPage = (offset) => {
	if (!store.option.scrollMode.enabled) return;
	const dir = offset > 0 ? "next" : "prev";
	if (handleEndTurnPage(dir)) return;
	if (!store.option.scrollMode.alignEdge) return scrollBy(offset, true);
	const viewBottom = scrollTop() + store.rootSize.height;
	let viewBottomPage = findTopPage(viewBottom);
	if (helper.approx(getPageTop(viewBottomPage), viewBottom)) viewBottomPage -= 1;
	const viewTop = scrollTop();
	let viewTopPage = findTopPage(viewTop);
	if (helper.approx(getPageTop(viewTopPage + 1), viewTop)) viewTopPage += 1;
	if (dir === "next") {
		const pageBottom = getPageTop(viewBottomPage + 1);
		if (!helper.approx(viewBottom, pageBottom)) {
			if (viewBottomPage === viewTopPage) {
				if (viewBottom + offset <= pageBottom) return scrollBy(offset, true);
				return scrollIntoView(viewBottomPage, "end");
			}
			return scrollIntoView(viewBottomPage, isFullView(viewBottomPage) ? "end" : "start");
		}
		const nextPage = viewBottomPage + 1;
		scrollIntoView(nextPage, isFullView(nextPage) ? "end" : "start");
	} else {
		const pageTop = getPageTop(viewTopPage);
		if (!helper.approx(viewTop, pageTop)) {
			if (viewBottomPage === viewTopPage) {
				if (viewTop + offset >= pageTop) return scrollBy(offset, true);
				return scrollIntoView(viewTopPage, "start");
			}
			return scrollIntoView(viewTopPage, isFullView(viewTopPage) ? "start" : "end");
		}
		const prevPage = viewTopPage - 1;
		scrollIntoView(prevPage, isFullView(prevPage) ? "start" : "end");
	}
};
/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapPageTurnKey = (nextPage) => {
	return (store.option.swapPageTurnKey ? !nextPage : nextPage) ? "next" : "prev";
};
const handleHotkey = (hotkey, e) => {
	stopAutoScroll();
	finishTurnAnimation();
	if (isAbreastMode()) switch (hotkey) {
		case "scroll_up": return setAbreastScrollFill(abreastScrollFill() - 40);
		case "scroll_down": return setAbreastScrollFill(abreastScrollFill() + 40);
		case "scroll_left":
			if (e?.repeat) return constantScroll.start(store.option.dir === "rtl" ? -1 : 1);
			return scrollBy(store.option.dir === "rtl" ? -40 : 40);
		case "scroll_right":
			if (e?.repeat) return constantScroll.start(store.option.dir === "rtl" ? 1 : -1);
			return scrollBy(store.option.dir === "rtl" ? 40 : -40);
		case "page_up": return scrollBy(-store.rootSize.width * .8);
		case "page_down": return scrollBy(store.rootSize.width * .8);
		case "jump_to_home": return scrollTo(0);
		case "jump_to_end": return scrollTo(scrollLength());
	}
	if (isScrollMode()) switch (hotkey) {
		case "page_up": return scrollViewTurnPage(-store.rootSize.height * .8);
		case "page_down": return scrollViewTurnPage(store.rootSize.height * .8);
		case "scroll_up":
			if (e?.repeat) return constantScroll.start(-1);
			return scrollBy(-40, true);
		case "scroll_down":
			if (e?.repeat) return constantScroll.start(1);
			return scrollBy(40, true);
	}
	switch (hotkey) {
		case "page_up":
		case "scroll_up": return turnPageAnimation("prev");
		case "page_down":
		case "scroll_down": return turnPageAnimation("next");
		case "scroll_left": return turnPageAnimation(handleSwapPageTurnKey(store.option.dir === "rtl"));
		case "scroll_right": return turnPageAnimation(handleSwapPageTurnKey(store.option.dir !== "rtl"));
		case "jump_to_home": return setState("activePageIndex", 0);
		case "jump_to_end": return setState("activePageIndex", Math.max(0, store.pageList.length - 1));
		case "switch_page_fill": return switchFillEffect();
		case "switch_scroll_mode": return switchScrollMode();
		case "switch_single_double_page_mode": return switchOnePageMode();
		case "switch_dir": return switchDir();
		case "translate_current_page": return translateCurrent();
		case "translate_all": return translateAll();
		case "translate_to_end": return translateToEnd();
		case "auto_scroll": return switchAutoScroll();
		case "fullscreen": return switchFullscreen();
		case "jump_next": return store.prop.onNext?.();
		case "jump_prev": return store.prop.onPrev?.();
		case "switch_auto_enlarge": return setOption("disableZoom", !store.option.disableZoom);
		case "reload_current_error_img":
			for (const i of showImgList()) reloadImg(getImg(i).src);
			return;
		case "exit": return store.prop.onExit?.();
		default:
			document.body.dispatchEvent(new KeyboardEvent("keydown", e));
			document.body.dispatchEvent(new KeyboardEvent("keyup", e));
	}
};
//#endregion
//#region src/components/Manga/actions/hotkeys.ts
const [defaultHotkeys, setDefaultHotkeys] = solid_js.createSignal({
	scroll_up: ["w", "ArrowUp"],
	scroll_down: ["s", "ArrowDown"],
	scroll_left: [
		"a",
		"Shift + a",
		",",
		"ArrowLeft"
	],
	scroll_right: [
		"d",
		"Shift + d",
		".",
		"ArrowRight"
	],
	page_up: ["PageUp", "Shift + w"],
	page_down: [
		" ",
		"PageDown",
		"Shift + s"
	],
	jump_to_home: ["Home"],
	jump_to_end: ["End"],
	exit: ["Escape"],
	switch_page_fill: [
		"/",
		"m",
		"z"
	],
	switch_scroll_mode: [],
	switch_single_double_page_mode: [],
	switch_dir: [],
	switch_auto_enlarge: [],
	translate_current_page: [],
	translate_all: [],
	translate_to_end: [],
	fullscreen: [],
	auto_scroll: [],
	jump_next: [],
	jump_prev: [],
	reload_current_error_img: ["r"]
});
/** 快捷键配置 */
const hotkeysMap = helper.createRootMemo(() => Object.fromEntries(Object.entries(store.hotkeys).flatMap(([name, key]) => key.map((k) => [k, name]))));
const actionsMap = {
	bubble: null,
	capture: null
};
const createKeydownHandler = (type) => (e) => {
	const actions = actionsMap[type];
	if (!actions) return;
	switch (e.target.tagName) {
		case "INPUT":
		case "TEXTAREA": return;
	}
	if (e.target.isContentEditable) return;
	if (Reflect.has(actions, e.key)) {
		if (actions[e.key](e) === "SKIP") return;
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
		return;
	}
	const hotkeyName = hotkeysMap()[helper.getKeyboardCode(e)];
	if (Reflect.has(actions, hotkeyName)) {
		if (actions[hotkeyName](e) === "SKIP") return;
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
	}
};
const handlers = {
	bubble: createKeydownHandler("bubble"),
	capture: createKeydownHandler("capture")
};
/** 监听快捷键 */
const listenHotkey = (actions, capture) => {
	const type = capture ? "capture" : "bubble";
	if (actionsMap[type]) Object.assign(actionsMap[type], actions);
	else {
		actionsMap[type] = { ...actions };
		window.addEventListener("keydown", handlers[type], { capture });
	}
	return () => {
		window.removeEventListener("keydown", handlers[type], { capture });
		actionsMap[type] = null;
	};
};
//#endregion
//#region src/components/Manga/actions/imageUpscale.ts
const upscaleImage = async (url, imgEle) => {
	setState("imgMap", url, "upscaleUrl", "");
	const { data, width, height } = helper.getImageData(imgEle);
	initWorker();
	await worker_ImageUpscale.default.upscaleImage(comlink.default.transfer(data, [data.buffer]), width, height, url);
};
let upscaleing = false;
const findUpscaleImage = async (start, end) => {
	for (let i = start; i < end; i++) {
		const img = typeof i === "number" ? getImg(i) : i;
		if (img.upscaleUrl !== void 0) continue;
		const imgEle = await helper.wait(() => getImgEle(img.src, true), 1e3);
		if (imgEle) return [img.src, imgEle];
	}
};
const handleUpscaleImage = async () => {
	if (upscaleing || !isUpscale() || store.imgList.length === 0) return;
	const targetImg = await findUpscaleImage(activeImgIndex(), store.imgList.length) ?? await findUpscaleImage(0, activeImgIndex());
	if (!targetImg) return;
	upscaleing = true;
	await upscaleImage(...targetImg);
	upscaleing = false;
	return handleUpscaleImage();
};
helper.createEffectOn([isUpscale, imgList], handleUpscaleImage);
const bufferToBase64 = (buffer) => {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) binary += String.fromCodePoint(bytes[i]);
	return window.btoa(binary);
};
const getModel = async () => {
	try {
		let base64;
		let buffer;
		if (typeof GM !== "undefined") base64 = await GM.getValue("@model.bin");
		if (!base64) {
			components_Toast.toast(helper.t("upscale.module_downloading"), {
				id: "upscale",
				duration: Infinity
			});
			const bin = await request.request("https://cdn.jsdelivr.net/npm/@hymbz/comic-read-script@11.12.1/public/realcugan/2x-conservative-128/group1-shard1of1.bin", {
				responseType: "arraybuffer",
				noTip: true
			});
			components_Toast.toast(helper.t("upscale.module_download_complete"), {
				id: "upscale",
				duration: 3e3
			});
			buffer = bin.response;
			base64 = bufferToBase64(buffer);
			await GM.setValue("@model.bin", base64);
		}
		const json = await helper.ensureGmValue("@model.json", async () => {
			return (await request.request("https://cdn.jsdelivr.net/npm/@hymbz/comic-read-script@11.12.1/public/realcugan/2x-conservative-128/model.json", { noTip: true })).responseText;
		});
		return {
			base64,
			json,
			buffer
		};
	} catch (error) {
		helper.log.error("获取图片放大模型出错", error);
		components_Toast.toast.dismiss("upscale");
		components_Toast.toast.error(helper.t("upscale.module_download_failed"), {
			id: "upscale",
			duration: Infinity
		});
		setState("supportUpscaleImage", false);
		setState("option", "imgRecognition", "upscale", false);
		throw error;
	}
};
const initWorker = helper.once(() => {
	const mainFn = {
		log: helper.log,
		toast: components_Toast.toast,
		t: helper.t,
		setImg: (url, key, val) => Reflect.has(store.imgMap, url) && setState("imgMap", url, key, val),
		getModel
	};
	worker_ImageUpscale.default.setMainFn(comlink.default.proxy(mainFn), Object.keys(mainFn));
});
//#endregion
//#region src/components/Manga/actions/operate.ts
const handleMouseDown = (e) => {
	if (e.button !== 1 || store.option.scrollMode.enabled) return;
	e.stopPropagation();
	e.preventDefault();
	switchFillEffect();
};
const handleKeyDown = (e) => {
	switch (e.target.tagName) {
		case "INPUT":
		case "TEXTAREA": return;
	}
	if (e.target.className === classes$2.hotkeysItem) return;
	stopAutoScroll();
	finishTurnAnimation();
	const code = helper.getKeyboardCode(e);
	if (e.key === "Escape") {
		if (store.show.pageTip || store.show.scrollbar || store.show.toolbar) {
			e.stopPropagation();
			e.preventDefault();
			return setState((state) => {
				state.show.pageTip = false;
				state.show.scrollbar = false;
				state.show.toolbar = false;
			});
		}
		if (store.show.endPage) {
			e.stopPropagation();
			e.preventDefault();
			return setState("show", "endPage", void 0);
		}
	}
	if (e.target.dataset.onlyNumber !== void 0) {
		if (/^(?:Shift \\+ )?[a-zA-Z]$/u.test(code)) {
			e.stopPropagation();
			e.preventDefault();
		}
		return;
	}
	if (isScrollMode() && !store.show.endPage) switch (e.key) {
		case "Home":
		case "End":
		case "ArrowRight":
		case "ArrowLeft": return e.stopPropagation();
		case "ArrowUp":
		case "PageUp":
			e.stopPropagation();
			return handleEndTurnPage("prev");
		case "ArrowDown":
		case "PageDown":
		case " ":
			e.stopPropagation();
			return handleEndTurnPage("next");
	}
	if (Reflect.has(hotkeysMap(), code)) {
		e.stopPropagation();
		e.preventDefault();
	} else return;
	handleHotkey(hotkeysMap()[code], e);
};
const handleKeyUp = (e) => {
	switch (hotkeysMap()[helper.getKeyboardCode(e)]) {
		case "scroll_left":
		case "scroll_right":
		case "scroll_up":
		case "scroll_down": return constantScroll.cancel();
	}
};
//#endregion
//#region src/components/Manga/hooks/useDoubleClick.ts
let clickTimeout = null;
const useDoubleClick = (click, doubleClick, timeout = 200) => (event) => {
	if (clickTimeout) {
		clearTimeout(clickTimeout);
		clickTimeout = null;
		doubleClick?.(event);
		return;
	}
	clickTimeout = window.setTimeout(() => {
		click(event);
		clickTimeout = null;
	}, timeout);
};
//#endregion
//#region src/components/Manga/actions/pointer.ts
/** 根据坐标找出被点击到的元素 */
const findClickEle = (eleList, { x, y }) => {
	for (const e of eleList) {
		const rect = e.getBoundingClientRect();
		if (helper.inRange(rect.left, x, rect.right) && helper.inRange(rect.top, y, rect.bottom)) return e;
	}
};
/** 触发点击区域操作 */
const handlePageClick = (e) => {
	for (const i of showImgList()) {
		const img = getImg(i);
		if (img.loadType !== "error") continue;
		const imgEle = getImgEle(img.src);
		if (!imgEle || !findClickEle([imgEle], e)) continue;
		return reloadImg(img.src);
	}
	const targetArea = findClickEle(refs.touchArea.children, e);
	if (!targetArea || getComputedStyle(targetArea).visibility === "hidden") return;
	const areaName = targetArea.dataset.area;
	if (!areaName) return;
	if (areaName === "menu" || areaName === "MENU") return setState((state) => {
		state.show.scrollbar = !state.show.scrollbar;
		state.show.toolbar = !state.show.toolbar;
		state.show.pageTip = !state.show.pageTip;
	});
	setState((state) => {
		resetUI(state);
		switch (areaName) {
			case "NEXT":
			case "next": return handleHotkey("page_down");
			case "PREV":
			case "prev": return handleHotkey("page_up");
		}
	});
};
/** 双击放大 */
const doubleClickZoom = (e) => zoom(store.option.zoom.ratio === 100 ? 350 : 100, e, true);
const handleClick = useDoubleClick(handlePageClick, doubleClickZoom);
/** 拖动页面的动画控制器 */
const dragAnim = new class extends helper.AnimationFrame {
	dx = 0;
	dy = 0;
	frame = () => {
		if (this.dx === store.page.offset.x.px && this.dy === store.page.offset.y.px) return this.cancel();
		setState((state) => {
			if (state.page.vertical) state.page.offset.y.px = this.dy;
			else state.page.offset.x.px = this.dx;
		});
		this.call(true);
	};
}();
/** 是否从翻页动画的当前偏移直接进入拖拽 */
let dragFromCurrentOffset = false;
const handleDragEnd = (startTime) => {
	dragAnim.dx = 0;
	dragAnim.dy = 0;
	dragAnim.cancel();
	const dir = store.page.vertical ? getTurnPageDir(-store.page.offset.y.px, store.rootSize.height, startTime) : getTurnPageDir(store.page.offset.x.px, store.rootSize.width, startTime);
	if (dir) return turnPageAnimation(dir, 100);
	setState((state) => {
		state.page.offset.x.px = 0;
		state.page.offset.y.px = 0;
		state.page.anima = "page";
		state.isDragMode = false;
	});
};
handleDragEnd.debounce = helper.debounce(handleDragEnd, 200);
const handleMangaFlowDrag = ({ type, xy: [x, y], initial: [ix, iy], startTime }) => {
	switch (type) {
		case "down":
			dragFromCurrentOffset = false;
			if (store.isTurnAnimating) {
				cancelTurnAnimation();
				dragFromCurrentOffset = true;
			}
			return;
		case "move": {
			dragAnim.dx = store.option.dir === "rtl" ? x - ix : ix - x;
			dragAnim.dy = y - iy;
			if (store.isDragMode) return dragAnim.call();
			let slideDir;
			const dxAbs = Math.abs(dragAnim.dx);
			const dyAbs = Math.abs(dragAnim.dy);
			if (dxAbs > 5 && dyAbs < 5) slideDir = "horizontal";
			if (dyAbs > 5 && dxAbs < 5) slideDir = "vertical";
			if (!slideDir) return;
			if (dragFromCurrentOffset) {
				dragFromCurrentOffset = false;
				setState("isDragMode", true);
			} else {
				cancelTurnAnimation();
				setState((state) => {
					state.page.vertical = slideDir === "vertical";
					state.isDragMode = true;
					resetPage(state);
				});
			}
			return;
		}
		case "up":
		case "cancel":
			dragFromCurrentOffset = false;
			return handleDragEnd(startTime);
	}
};
//#endregion
//#region src/components/Manga/actions/scrollMode.ts
/** 修改卷轴模式下图片的目标宽度 */
const setAdjustToWidth = (val) => {
	if (typeof store.option.scrollMode.adjustToWidth !== "number") return;
	if (typeof val === "function") val = val(store.option.scrollMode.adjustToWidth);
	if (Number.isNaN(val)) return;
	const jump = saveScrollProgress();
	const newVal = helper.clamp(200, val, Math.ceil(store.rootSize.width));
	setOption("scrollMode", "adjustToWidth", newVal);
	jump();
};
const minImgWidth = helper.createRootMemo(() => {
	let min = Infinity;
	for (const img of Object.values(store.imgMap)) if (img.width && img.width < min) min = img.width;
	return min;
});
/** 在卷轴模式下进行缩放，并且保持滚动进度不变 */
const setImgScale = (val) => {
	if (typeof val === "function") val = val(store.option.scrollMode.imgScale);
	if (Number.isNaN(val)) return;
	const jump = saveScrollProgress();
	let newVal = helper.clamp(.1, val, 3);
	if (minImgWidth() > store.rootSize.width && newVal < store.option.scrollMode.imgScale) {
		const maxImgScale = store.rootSize.width / minImgWidth();
		if (newVal > maxImgScale) newVal = maxImgScale;
	}
	newVal = Number(newVal.toFixed(2));
	setOption("scrollMode", "imgScale", helper.clamp(.1, newVal, 3));
	jump();
};
/** 处理卷轴模式下的放大/缩小操作 */
const handleScrollModeZoom = (dir) => {
	if (!store.option.scrollMode.enabled) return;
	if (store.option.scrollMode.adjustToWidth === "full") return;
	if (store.option.scrollMode.adjustToWidth === "disable" || isAbreastMode()) setImgScale((val) => val + .05 * (dir === "add" ? 1 : -1));
	else setAdjustToWidth((val) => val + 100 * (dir === "add" ? 1 : -1));
};
//#endregion
//#region src/components/Manga/actions/scrollModeDrag.ts
/** 摩擦系数 */
const FRICTION_COEFF = .96;
const calcVelocityAnim = new class extends helper.AnimationFrame {
	lastTop = 0;
	dy = 0;
	lastLeft = 0;
	dx = 0;
	frame = () => {
		const nowTop = store.option.scrollMode.abreastMode ? abreastScrollFill() : scrollTop();
		this.dy = nowTop - this.lastTop;
		this.lastTop = nowTop;
		this.dx = store.page.offset.x.px - this.lastLeft;
		this.lastLeft = store.page.offset.x.px;
		this.call(true);
	};
}();
const slideAnim = new class extends helper.AnimationFrame {
	lastTime = 0;
	frame = (timestamp) => {
		if (Math.abs(calcVelocityAnim.dx) + Math.abs(calcVelocityAnim.dy) < 1) {
			this.animationId = 0;
			return;
		}
		if (timestamp - this.lastTime > 16) {
			calcVelocityAnim.dy *= FRICTION_COEFF;
			calcVelocityAnim.dx *= FRICTION_COEFF;
			this.lastTime = timestamp;
		}
		if (store.option.scrollMode.abreastMode) {
			scrollTo(scrollTop() + calcVelocityAnim.dx);
			setAbreastScrollFill(abreastScrollFill() + calcVelocityAnim.dy);
		} else scrollTo(scrollTop() + calcVelocityAnim.dy);
		this.call(true);
	};
}();
let initTop = 0;
let initLeft = 0;
let initAbreastScrollFill = 0;
const handleScrollModeDrag = ({ type, xy: [x, y], initial: [ix, iy], startTime }, e) => {
	if (!store.option.scrollMode.abreastMode && e.pointerType !== "mouse") return;
	switch (type) {
		case "down":
			calcVelocityAnim.cancel();
			slideAnim.cancel();
			initTop = refs.mangaBox.scrollTop;
			initLeft = store.page.offset.x.px * (store.option.dir === "rtl" ? 1 : -1);
			initAbreastScrollFill = abreastScrollFill();
			calcVelocityAnim.call();
			return;
		case "move":
			if (store.option.scrollMode.abreastMode) {
				const _dx = x - ix;
				const _dy = y - iy;
				scrollTo((initLeft + _dx) * (store.option.dir === "rtl" ? 1 : -1));
				setAbreastScrollFill(initAbreastScrollFill + _dy);
			} else scrollTo(initTop + iy - y);
			return;
		case "up":
			calcVelocityAnim.cancel();
			if (performance.now() - startTime < 50) return;
			slideAnim.call();
			saveReadProgress();
	}
};
//#endregion
//#region src/components/Manga/actions/scrollbar.ts
/** 判断点击位置在滚动条上的位置比率 */
const getClickTop = (x, y, e) => {
	switch (scrollPosition()) {
		case "bottom":
		case "top": return store.option.dir === "rtl" ? 1 - x / e.offsetWidth : x / e.offsetWidth;
		default: return y / e.offsetHeight;
	}
};
/** 计算在滚动条上的拖动距离 */
const getSliderDist = ([x, y], [ix, iy], e) => {
	switch (scrollPosition()) {
		case "bottom":
		case "top": return store.option.dir === "rtl" ? (1 - (x - ix)) / e.offsetWidth : (x - ix) / e.offsetWidth;
		default: return (y - iy) / e.offsetHeight;
	}
};
const [isDrag, setIsDrag] = solid_js.createSignal(false);
const closeDrag = helper.debounce(() => setIsDrag(false), 200);
let lastType = "up";
/** 开始拖拽时的 sliderTop 值 */
let startTop = 0;
const handleScrollbarSlider = ({ type, xy, initial }, e) => {
	stopAutoScroll();
	finishTurnAnimation();
	const [x, y] = xy;
	if (type === "move" && lastType === type) {
		setIsDrag(true);
		closeDrag();
	}
	lastType = type;
	if (type === "up") return saveReadProgress();
	if (!refs.mangaFlow) return;
	const scrollbarDom = e.target;
	/** 点击位置在滚动条上的位置比率 */
	const clickTop = getClickTop(x, y, e.target);
	if (store.option.scrollMode.enabled) {
		if (type === "move") {
			const top = helper.clamp(0, startTop + getSliderDist(xy, initial, scrollbarDom), 1) * scrollLength();
			scrollTo(top);
		} else {
			startTop = clickTop - sliderHeight() / 2;
			const top = startTop * scrollLength();
			scrollTo(top, true);
		}
	} else {
		let newPageIndex = Math.floor(clickTop * store.pageList.length);
		if (newPageIndex < 0) newPageIndex = 0;
		else if (newPageIndex >= store.pageList.length) newPageIndex = store.pageList.length - 1;
		if (newPageIndex !== store.activePageIndex) setState("activePageIndex", newPageIndex);
	}
};
//#endregion
//#region src/components/Manga/actions/wheel/scrollDevice.ts
/** 判断两个数值是否成整数倍 */
const isMultipleOf = (a, b) => (a < b ? b % a : a % b) === 0;
/** C 类设备下连续出现成倍滚动量的次数，达到阈值才允许切换为 A/B 类 */
let consecutiveMultiple = 0;
let lastDelta = Infinity;
/** 根据传入的滚动事件判定滚动设备类型 */
const detectScrollDevice = (e) => {
	const absDelta = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
	let type;
	if (e.deltaMode !== 0) type = "a";
	else if (e.phase !== void 0) type = "c";
	else if (absDelta < 10 || lastDelta < 10) type = "c";
	else if (lastDelta === Infinity) type = void 0;
	else if (isMultipleOf(lastDelta, absDelta)) {
		if (store.scrollDeviceType === "c" && ++consecutiveMultiple < 3) type = void 0;
		else {
			consecutiveMultiple = 0;
			type = Math.max(lastDelta, absDelta) >= 40 ? "a" : "b";
		}
	} else type = "c";
	if (type === "c") consecutiveMultiple = 0;
	lastDelta = absDelta;
	if (type) setState("scrollDeviceType", type);
};
//#endregion
//#region src/components/Manga/actions/wheel/wheelRatchet.ts
/** 虚拟棘轮步长 */
const wheelStepLength = helper.createRootMemo(() => {
	switch (store.scrollDeviceType) {
		case "a":
		case "b": return 120;
		case "c": return 360;
		case void 0: return Infinity;
	}
});
const wheelRatchet = new class {
	/** 带方向的累计滚动量，正数表示向下滚动 */
	wheelDy = 0;
	/** 按当前步长处理累计滚动量进行翻页 */
	processWheel = (state) => {
		const step = wheelStepLength();
		while (this.wheelDy <= -step) {
			if (!turnPage("next", state)) {
				this.wheelDy = -step;
				break;
			}
			this.wheelDy += step;
		}
		while (this.wheelDy >= step) {
			if (!turnPage("prev", state)) {
				this.wheelDy = step;
				break;
			}
			this.wheelDy -= step;
		}
		state.wheelProgress = -this.wheelDy / step;
		resetPage(state);
	};
	processWheelThrottled = helper.throttle(() => setState(this.processWheel), 16);
	/** 停止滚动一段时间后重置状态 */
	handleWheelEnd = helper.debounce(() => {
		this.wheelDy = 0;
		setState("wheelProgress", 0);
	}, 300);
	/** 处理滚动产生的连续位移，通过虚拟棘轮（累计满一个步长）实现翻页 */
	handleContinuousWheel(delta) {
		if (store.option.scrollMode.enabled) return;
		openScrollLock();
		this.wheelDy += Math.floor(delta);
		this.processWheelThrottled();
		this.handleWheelEnd();
	}
}();
//#endregion
//#region src/components/Manga/actions/wheel/index.ts
let firstWheelTimer = 0;
/** 获取滚轮事件的主轴向与主轴向滚动量 */
const getWheelAxis = (e) => {
	const absDeltaX = Math.abs(e.deltaX);
	const absDeltaY = Math.abs(e.deltaY);
	const horizontal = absDeltaX > absDeltaY;
	return {
		horizontal,
		delta: horizontal ? e.deltaX : e.deltaY,
		absDelta: horizontal ? absDeltaX : absDeltaY
	};
};
/** 根据主轴向与漫画方向计算翻页方向 */
const getWheelDir = (horizontal, delta) => {
	if (horizontal) {
		if (store.option.dir === "rtl") return delta < 0 ? "next" : "prev";
		return delta > 0 ? "next" : "prev";
	}
	return delta > 0 ? "next" : "prev";
};
/** A 类设备直接翻页，不经过虚拟棘轮 */
const turnPageByWheel = (dir) => {
	wheelRatchet.wheelDy = 0;
	openScrollLock();
	turnPageAnimation(dir);
};
const handleWheel = (e) => {
	stopAutoScroll();
	finishTurnAnimation();
	e.stopPropagation();
	if (e.ctrlKey || e.altKey) e.preventDefault();
	const { horizontal, delta, absDelta } = getWheelAxis(e);
	const isPositiveDelta = delta > 0;
	const dir = getWheelDir(horizontal, delta);
	if (absDelta === 0) return;
	if (isScrollMode() && horizontal) return;
	if ((e.ctrlKey || e.altKey) && store.option.scrollMode.enabled && store.option.zoom.ratio === 100) {
		e.preventDefault();
		return handleScrollModeZoom(isPositiveDelta ? "sub" : "add");
	}
	if (e.ctrlKey || e.altKey) {
		e.preventDefault();
		return zoom(store.option.zoom.ratio + (isPositiveDelta ? -25 : 25), e);
	}
	if (store.page.vertical === horizontal) setState((state) => {
		state.page.vertical = !horizontal;
		resetPage(state);
	});
	if (!isScrollMode()) e.preventDefault();
	detectScrollDevice(e);
	if (store.scrollDeviceType === void 0) firstWheelTimer = window.setTimeout(() => {
		setState("scrollDeviceType", "a");
		turnPageByWheel(dir);
	}, 100);
	else if (firstWheelTimer) {
		clearTimeout(firstWheelTimer);
		firstWheelTimer = 0;
	}
	if (absDelta >= 5 && handleEndTurnPage(dir)) {
		openScrollLock();
		return e.preventDefault();
	}
	if (isAbreastMode() && store.option.zoom.ratio === 100) {
		e.preventDefault();
		scrollBy(delta, true);
	}
	if (store.option.scrollMode.enabled) return;
	if (store.scrollDeviceType === "a") return turnPageByWheel(dir);
	return wheelRatchet.handleContinuousWheel(dir === "next" ? -absDelta : absDelta);
};
//#endregion
//#region src/components/Manga/hooks/useEventListener.ts
const useEventListener = (ref) => {
	const listeners = /* @__PURE__ */ new Map();
	solid_js.createEffect(() => {
		const el = ref();
		if (!el) return;
		for (const [type, list] of listeners) for (const { listener, options } of list) el.addEventListener(type, listener, options);
		solid_js.onCleanup(() => {
			for (const [type, list] of listeners) for (const { listener, options } of list) el.removeEventListener(type, listener, options);
		});
	});
	return (type, listener, options) => {
		const list = listeners.get(type) ?? [];
		list.push({
			listener,
			options
		});
		listeners.set(type, list);
	};
};
//#endregion
//#region src/components/Manga/hooks/useHiddenMouse.ts
/** 在鼠标静止一段时间后自动隐藏 */
const useHiddenMouse = (ref) => {
	const [hiddenMouse, setHiddenMouse] = solid_js.createSignal(true);
	const on = useEventListener(ref);
	const hidden = helper.debounce(() => setHiddenMouse(true), 1e3);
	on("mousemove", () => {
		setHiddenMouse(false);
		hidden();
	});
	on("mouseleave", () => {
		hidden.clear();
		setHiddenMouse(false);
	});
	return hiddenMouse;
};
//#endregion
//#region src/components/Manga/hooks/useStyle.ts
function css$1(arg1, arg2, ...rest) {
	solid_js.onMount(() => {
		if (typeof arg1 !== "object" || !("raw" in arg1)) {
			if (arg2 === void 0) helper.css(arg1, refs.root);
			else helper.css(arg1, arg2, refs.root);
		} else helper.css(["", ...arg1], refs.root, ...rest);
	});
}
//#endregion
//#region src/components/Manga/components/ComicImg.tsx
var _tmpl$$37 = /*#__PURE__*/ solid_js_web.template(\`<img draggable=false decoding=async>\`);
var _tmpl$2$8 = /*#__PURE__*/ solid_js_web.template(\`<div><picture><div>\`);
const ComicImg = (img) => {
	const showState = () => store.imgShowState[img.index];
	solid_js.createEffect(() => src() && getImgEle(img.src)?.decode());
	const src = () => {
		if (img.loadType === "wait") return "";
		if (img.translationType === "show") return img.translationUrl;
		if (store.option.imgRecognition.enabled) {
			if (store.option.imgRecognition.upscale && img.upscaleUrl) return img.upscaleUrl;
			return img.blobUrl;
		}
		if (img.src.startsWith("blob:")) return img.src.replace(/#\\..+/u, "");
		return img.src;
	};
	/** 并排卷轴模式下需要复制的图片数量 */
	const cloneNum = solid_js.createMemo(() => {
		if (!isAbreastMode()) return 0;
		const imgPosition = abreastArea().position[img.index];
		return imgPosition ? imgPosition.length - 1 : 0;
	});
	/** 打开「边缘裁切」后使用的样式 */
	const cropStyle = solid_js.createMemo(() => {
		const crop = getCropMargin(img);
		if (!crop) return null;
		const cw = 1 - crop.left - crop.right;
		const ch = 1 - crop.top - crop.bottom;
		const picture = { overflow: "clip" };
		const isDisableZoomNonScroll = store.option.disableZoom && !store.option.scrollMode.enabled;
		if (isDisableZoomNonScroll || isAbreastMode()) {
			if (isDisableZoomNonScroll) {
				const pageIndex = imgPageMap()[img.index];
				const isFullWidth = (pageIndex === void 0 ? void 0 : store.pageList[pageIndex])?.length === 1;
				const scale = Math.min(1, store.rootSize.width * (isFullWidth ? 1 : .5) / img.size.width, store.rootSize.height / img.size.height) || 1;
				picture.width = \`\${img.size.width * scale}px\`;
				picture.height = \`\${img.size.height * scale}px\`;
			} else {
				picture.width = \`\${img.size.width}px\`;
				picture.height = \`\${img.size.height}px\`;
			}
		}
		return {
			imgEle: {
				position: "absolute",
				left: \`\${-crop.left / cw * 100}%\`,
				top: \`\${-crop.top / ch * 100}%\`,
				width: \`\${1 / cw * 100}%\`,
				height: \`\${1 / ch * 100}%\`,
				"max-width": "none",
				"max-height": "none",
				"object-fit": "fill"
			},
			picture
		};
	});
	const styles = solid_js.createMemo(() => ({
		img: {
			"grid-area": isAbreastMode() ? "none" : \`_\${img.index}\`,
			"background-color": isEnableBg() ? img.background ?? void 0 : void 0
		},
		imgEle: cropStyle()?.imgEle,
		picture: {
			"aspect-ratio": \`\${img.size.width} / \${img.size.height}\`,
			background: img.progress ? \`linear-gradient(
              to bottom,
              var(--secondary-bg) \${img.progress}%,
              var(--hover-bg-color,#fff3) \${img.progress}%
            )\` : void 0,
			...cropStyle()?.picture
		}
	}));
	const ComicImgBase = (props) => (() => {
		var _el$ = _tmpl$2$8(), _el$2 = _el$.firstChild, _el$4 = _el$2.firstChild;
		solid_js_web.insert(_el$2, solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return src();
			},
			get children() {
				var _el$3 = _tmpl$$37();
				_el$3.addEventListener("error", (e) => handleImgError(img.src, e.currentTarget));
				_el$3.addEventListener("load", (e) => handleImgLoaded(img.src, e.currentTarget));
				solid_js_web.use((el) => {
					refs.imgEleMap[img.src] ??= /* @__PURE__ */ new Set();
					const set = refs.imgEleMap[img.src];
					set.add(el);
					solid_js.onCleanup(() => {
						set.delete(el);
						if (set.size === 0) delete refs.imgEleMap[img.src];
					});
				}, _el$3);
				solid_js_web.effect((_p$) => {
					var _v$ = styles().imgEle, _v$2 = src(), _v$3 = \`\${img.index}\`, _v$4 = img.src;
					_p$.e = solid_js_web.style(_el$3, _v$, _p$.e);
					_v$2 !== _p$.t && solid_js_web.setAttribute(_el$3, "src", _p$.t = _v$2);
					_v$3 !== _p$.a && solid_js_web.setAttribute(_el$3, "alt", _p$.a = _v$3);
					_v$4 !== _p$.o && solid_js_web.setAttribute(_el$3, "data-src", _p$.o = _v$4);
					return _p$;
				}, {
					e: void 0,
					t: void 0,
					a: void 0,
					o: void 0
				});
				return _el$3;
			}
		}), _el$4);
		solid_js_web.insert(_el$4, () => getImgTip(img.index));
		solid_js_web.effect((_p$) => {
			var _v$5 = classes$2.img, _v$6 = \`_\${img.index}_\${props.cloneIndex ?? 0}\`, _v$7 = styles().img, _v$8 = showState(), _v$9 = img.type ?? store.defaultImgType, _v$0 = img.loadType === "loaded" ? void 0 : img.loadType, _v$1 = styles().picture, _v$10 = classes$2.pageTip;
			_v$5 !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$5);
			_v$6 !== _p$.t && solid_js_web.setAttribute(_el$, "id", _p$.t = _v$6);
			_p$.a = solid_js_web.style(_el$, _v$7, _p$.a);
			_v$8 !== _p$.o && solid_js_web.setAttribute(_el$, "data-show", _p$.o = _v$8);
			_v$9 !== _p$.i && solid_js_web.setAttribute(_el$, "data-type", _p$.i = _v$9);
			_v$0 !== _p$.n && solid_js_web.setAttribute(_el$, "data-load-type", _p$.n = _v$0);
			_p$.s = solid_js_web.style(_el$2, _v$1, _p$.s);
			_v$10 !== _p$.h && solid_js_web.className(_el$4, _p$.h = _v$10);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0,
			s: void 0,
			h: void 0
		});
		return _el$;
	})();
	return [solid_js_web.createComponent(ComicImgBase, {}), solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return cloneNum() > 0;
		},
		get children() {
			return solid_js_web.createComponent(solid_js.For, {
				get each() {
					return Array.from({ length: cloneNum() });
				},
				children: (_, i) => solid_js_web.createComponent(ComicImgBase, { get cloneIndex() {
					return i() + 1;
				} })
			});
		}
	})];
};
//#endregion
//#region src/components/Manga/components/EmptyTip.tsx
var _tmpl$$36 = /*#__PURE__*/ solid_js_web.template(\`<h1 style=opacity:0>\`);
const EmptyTip = () => {
	let ref;
	helper.onAutoMount(() => {
		let timeoutId = 0;
		const observer = new IntersectionObserver(([{ isIntersecting }]) => {
			if (!isIntersecting) return;
			timeoutId = window.setTimeout(() => {
				ref?.style.removeProperty("opacity");
				timeoutId = 0;
			}, 2e3);
		}, { threshold: 1 });
		observer.observe(ref);
		return () => {
			observer.disconnect();
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
	return (() => {
		var _el$ = _tmpl$$36();
		var _ref$ = ref;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$) : ref = _el$;
		_el$.textContent = "NULL";
		return _el$;
	})();
};
//#endregion
//#region src/components/Manga/components/ComicImgFlow.tsx
var _tmpl$$35 = /*#__PURE__*/ solid_js_web.template(\`<div tabindex=-1><div tabindex=-1>\`);
const ComicImgFlow = () => {
	const hiddenMouse = useHiddenMouse(() => refs.mangaFlow);
	const handleDrag = (state, e) => {
		stopAutoScroll();
		if (touches.size > 1) return handlePinchZoom(state, e);
		if (store.option.zoom.ratio !== 100) return handleZoomDrag(state, e);
		if (store.option.scrollMode.enabled) return handleScrollModeDrag(state, e);
		return handleMangaFlowDrag(state, e);
	};
	solid_js.onMount(() => {
		helper.useDrag({
			ref: refs.mangaBox,
			handleDrag,
			handleClick,
			touches,
			setCapture: true
		});
		bindScrollTop(refs.mangaBox);
	});
	const handleTransitionEnd = () => {
		if (store.isDragMode || store.isTurnAnimating) return;
		setState((state) => {
			if (store.option.zoom.ratio === 100) resetPage(state, false);
			else state.page.anima = "";
		});
	};
	/** 在当前页之前有图片被加载出来，导致内容高度发生变化后，重新滚动页面，确保当前显示位置不变 */
	helper.createEffectOn([
		() => store.showRange[0],
		() => pageTopList()[store.showRange[0]],
		pageTopList
	], ([showImg, height, topList], prev) => {
		if (!prev || !height || !isScrollMode()) return;
		const [prevShowImg, prevHeight, prevTopList] = prev;
		if (showImg !== prevShowImg || prevTopList === topList || prevHeight === height) return;
		scrollTo(scrollTop() + height - prevHeight);
	});
	const pageToText = (page) => (page.length === 1 ? [page[0], page[0]] : page).map((i) => i === -1 ? "." : \`_\${i}\`).join(" ");
	const gridAreas = solid_js.createMemo(() => {
		if (store.pageList.length === 0) return;
		if (store.option.scrollMode.enabled) {
			if (store.option.scrollMode.abreastMode) return \`"\${helper.range(abreastArea().columns.length, (i) => \`_\${i}\`).join(" ")}"\`;
			if (store.option.scrollMode.doubleMode) {
				const { pageColumns } = store.option.scrollMode;
				return scrollPageList().map((row) => {
					const missNum = pageColumns * 2 - row.length * 2;
					return \`"\${[...row.map(pageToText), ...helper.range(missNum, ".")].join(" ")}"\`;
				}).join("\\n");
			}
			return helper.range(store.imgList.length, (i) => \`"_\${i}"\`).join("\\n");
		}
		return store.page.vertical ? store.pageList.slice(store.renderRange[0], store.renderRange[1] + 1).map((page) => \`"\${pageToText(page)}"\`).join("\\n") : \`"\${store.pageList.slice(store.renderRange[0], store.renderRange[1] + 1).map(pageToText).join(" ")}"\`;
	});
	css$1(\`.\${classes$2.mangaBox}\`, { transform: () => \`translate(\${store.option.zoom.offset.x}px, \${store.option.zoom.offset.y}px)
        scale(\${store.option.zoom.ratio / 100})\` });
	const pageX = solid_js.createMemo(() => {
		if (isScrollMode()) return 0;
		let x = store.page.offset.x.pct * store.rootSize.width + store.page.offset.x.px;
		if (store.option.dir !== "rtl") x = -x;
		return x;
	});
	css$1(\`#\${classes$2.mangaFlow}\`, {
		left: () => \`\${pageX()}px\`,
		top: () => \`\${store.page.offset.y.pct * store.rootSize.height + store.page.offset.y.px}px\`,
		"touch-action"() {
			if (store.option.zoom.ratio === 100) return;
			if (!store.option.scrollMode.enabled) return "none";
			if (store.option.zoom.offset.y === 0) return "pan-up";
			if (store.option.zoom.offset.y === bound().y) return "pan-down";
		},
		"grid-template-areas": gridAreas,
		"grid-template-columns"() {
			if (store.imgList.length === 0) return;
			if (store.option.scrollMode.enabled) {
				if (store.option.scrollMode.abreastMode) return \`repeat(\${abreastArea().columns.length}, \${abreastColumnWidth()}px)\`;
				if (store.option.scrollMode.doubleMode) return \`repeat(\${store.option.scrollMode.pageColumns * 2}, 1fr)\`;
				return;
			}
			if (store.page.vertical) return "50% 50%";
			return \`repeat(\${gridAreas()?.split(" ").length ?? 0}, 50%)\`;
		},
		"grid-template-rows"() {
			if (isScrollMode()) return pageHeightList().map((num) => \`\${num}px\`).join(" ");
		},
		"background-color": () => isEnableBg() ? getImg(activeImgIndex())?.background ?? void 0 : void 0
	});
	css$1(imgAreaStyle);
	const renderList = solid_js.createMemo(() => {
		const list = new Set(renderImgList());
		for (const url of loadState.loadingUrlSet) {
			const indexList = imgIndexMap().get(url);
			if (!indexList) continue;
			if (indexList.some((index) => list.has(index))) continue;
			list.add(indexList[0]);
		}
		return [...list].toSorted((a, b) => a - b);
	});
	return (() => {
		var _el$ = _tmpl$$35(), _el$2 = _el$.firstChild;
		solid_js_web.addEventListener(_el$, "scrollend", focus);
		_el$.addEventListener("transitionend", handleTransitionEnd);
		var _ref$ = bindRef("mangaBox");
		typeof _ref$ === "function" && solid_js_web.use(_ref$, _el$);
		_el$2.addEventListener("transitionend", handleTransitionEnd);
		var _ref$2 = bindRef("mangaFlow");
		typeof _ref$2 === "function" && solid_js_web.use(_ref$2, _el$2);
		solid_js_web.insert(_el$2, solid_js_web.createComponent(solid_js.For, {
			get each() {
				return renderList();
			},
			get fallback() {
				return solid_js_web.createComponent(EmptyTip, {});
			},
			children: (i) => solid_js_web.createComponent(ComicImg, solid_js_web.mergeProps({ index: i }, () => store.imgMap[store.imgList[i]]))
		}));
		solid_js_web.effect((_p$) => {
			var _v$ = \`\${classes$2.mangaBox} \${classes$2.beautifyScrollbar}\`, _v$2 = store.page.anima, _v$3 = helper.boolDataVal(store.option.scrollMode.abreastMode), _v$4 = classes$2.mangaFlow, _v$5 = store.option.dir, _v$6 = \`\${classes$2.mangaFlow} \${classes$2.beautifyScrollbar}\`, _v$7 = helper.boolDataVal(store.option.disableZoom && !store.option.scrollMode.enabled), _v$8 = helper.boolDataVal(store.option.zoom.ratio !== 100), _v$9 = helper.boolDataVal(store.page.vertical), _v$0 = store.option.autoHiddenMouse && hiddenMouse();
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-animation", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "data-abreast-scroll", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$2, "id", _p$.o = _v$4);
			_v$5 !== _p$.i && solid_js_web.setAttribute(_el$2, "dir", _p$.i = _v$5);
			_v$6 !== _p$.n && solid_js_web.className(_el$2, _p$.n = _v$6);
			_v$7 !== _p$.s && solid_js_web.setAttribute(_el$2, "data-disable-zoom", _p$.s = _v$7);
			_v$8 !== _p$.h && solid_js_web.setAttribute(_el$2, "data-scale-mode", _p$.h = _v$8);
			_v$9 !== _p$.r && solid_js_web.setAttribute(_el$2, "data-vertical", _p$.r = _v$9);
			_v$0 !== _p$.d && solid_js_web.setAttribute(_el$2, "data-hidden-mouse", _p$.d = _v$0);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0,
			s: void 0,
			h: void 0,
			r: void 0,
			d: void 0
		});
		return _el$;
	})();
};
//#endregion
//#region src/components/Manga/components/TouchArea.tsx
var _tmpl$$34 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
var _tmpl$2$7 = /*#__PURE__*/ solid_js_web.template(\`<div role=button tabindex=-1>\`);
const areaArrayMap = {
	left_right: [
		[
			"prev",
			"menu",
			"next"
		],
		[
			"PREV",
			"MENU",
			"NEXT"
		],
		[
			"prev",
			"menu",
			"next"
		]
	],
	up_down: [
		[
			"prev",
			"PREV",
			"prev"
		],
		[
			"menu",
			"MENU",
			"menu"
		],
		[
			"next",
			"NEXT",
			"next"
		]
	],
	edge: [
		[
			"next",
			"menu",
			"next"
		],
		[
			"NEXT",
			"MENU",
			"NEXT"
		],
		[
			"next",
			"PREV",
			"next"
		]
	],
	l: [
		[
			"PREV",
			"prev",
			"prev"
		],
		[
			"prev",
			"MENU",
			"next"
		],
		[
			"next",
			"next",
			"NEXT"
		]
	]
};
const areaType = helper.createRootMemo(() => Reflect.has(areaArrayMap, store.option.clickPageTurn.area) ? store.option.clickPageTurn.area : "left_right");
const dir = helper.createRootMemo(() => {
	if (!store.option.clickPageTurn.reverse) return store.option.dir;
	return store.option.dir === "rtl" ? "ltr" : "rtl";
});
const TouchArea = () => (() => {
	var _el$ = _tmpl$$34();
	var _ref$ = bindRef("touchArea");
	typeof _ref$ === "function" && solid_js_web.use(_ref$, _el$);
	solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js.For, {
		get each() {
			return areaArrayMap[areaType()];
		},
		children: (rows) => solid_js_web.createComponent(solid_js.For, {
			each: rows,
			children: (area) => (() => {
				var _el$2 = _tmpl$2$7();
				solid_js_web.setAttribute(_el$2, "data-area", area);
				solid_js_web.effect(() => solid_js_web.className(_el$2, classes$2.touchArea));
				return _el$2;
			})()
		})
	}));
	solid_js_web.effect((_p$) => {
		var _v$ = classes$2.touchAreaRoot, _v$2 = dir(), _v$3 = helper.boolDataVal(store.show.touchArea), _v$4 = areaType(), _v$5 = helper.boolDataVal(store.option.clickPageTurn.enabled), _v$6 = helper.boolDataVal(store.option.clickPageTurn.shrinkMenu);
		_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
		_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "dir", _p$.t = _v$2);
		_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "data-show", _p$.a = _v$3);
		_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-area", _p$.o = _v$4);
		_v$5 !== _p$.i && solid_js_web.setAttribute(_el$, "data-turn-page", _p$.i = _v$5);
		_v$6 !== _p$.n && solid_js_web.setAttribute(_el$, "data-shrink-menu", _p$.n = _v$6);
		return _p$;
	}, {
		e: void 0,
		t: void 0,
		a: void 0,
		o: void 0,
		i: void 0,
		n: void 0
	});
	return _el$;
})();
//#endregion
//#region src/components/Manga/components/EndPage.tsx
var _tmpl$$33 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
var _tmpl$2$6 = /*#__PURE__*/ solid_js_web.template(\`<div role=button tabindex=-1><div><p></p><button type=button></button><button type=button data-is-end></button><button type=button>\`);
var _tmpl$3$2 = /*#__PURE__*/ solid_js_web.template(\`<p>\`);
let delayTypeTimer = 0;
const EndPage = () => {
	const handleClick = (e) => {
		e.stopPropagation();
		if (e.target?.nodeName !== "BUTTON") setState("show", "endPage", void 0);
		focus();
	};
	let ref;
	const [isDrag, setIsDrag] = solid_js.createSignal(false);
	const [dragY, setDragY] = solid_js.createSignal(0);
	const handleDrag = ({ type, xy: [, y], initial: [, iy], startTime }) => {
		switch (type) {
			case "down": return setIsDrag(true);
			case "move": return setDragY(y - iy);
		}
		const pageDir = getTurnPageDir(-dragY(), store.rootSize.height / 2, startTime);
		if (pageDir) handleEndTurnPage(pageDir);
		setDragY(0);
		setIsDrag(false);
	};
	solid_js.onMount(() => {
		helper.useDrag({
			ref,
			handleDrag,
			skip: (e) => e.target.matches(\`.\${classes$2.comments}, .\${classes$2.comments} *\`)
		});
	});
	const [delayType, setDelayType] = solid_js.createSignal();
	solid_js.createEffect(() => {
		if (store.show.endPage) {
			window.clearTimeout(delayTypeTimer);
			setDelayType(store.show.endPage);
		} else delayTypeTimer = window.setTimeout(() => setDelayType(store.show.endPage), 500);
	});
	const tip = solid_js.createMemo(() => {
		if (store.option.scroolEnd === "none") return "";
		switch (delayType()) {
			case "start":
				if (!store.prop.onPrev || store.option.scroolEnd !== "auto") break;
				return helper.t("end_page.tip.start_jump");
			case "end":
				if (store.prop.onNext && store.option.scroolEnd === "auto") return helper.t("end_page.tip.end_jump");
				if (store.prop.onExit) return helper.t("end_page.tip.exit");
		}
		return "";
	});
	return (() => {
		var _el$ = _tmpl$2$6(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling;
		solid_js_web.addEventListener(_el$, "click", handleClick);
		var _ref$ = ref;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$) : ref = _el$;
		solid_js_web.insert(_el$3, tip);
		solid_js_web.addEventListener(_el$4, "click", () => store.prop.onPrev?.());
		var _ref$2 = bindRef("prev");
		typeof _ref$2 === "function" && solid_js_web.use(_ref$2, _el$4);
		solid_js_web.insert(_el$4, () => helper.t("end_page.prev_button"));
		solid_js_web.addEventListener(_el$5, "click", () => store.prop.onExit?.(store.show.endPage === "end"));
		var _ref$3 = bindRef("exit");
		typeof _ref$3 === "function" && solid_js_web.use(_ref$3, _el$5);
		solid_js_web.insert(_el$5, () => helper.t("other.exit"));
		solid_js_web.addEventListener(_el$6, "click", () => store.prop.onNext?.());
		var _ref$4 = bindRef("next");
		typeof _ref$4 === "function" && solid_js_web.use(_ref$4, _el$6);
		solid_js_web.insert(_el$6, () => helper.t("end_page.next_button"));
		solid_js_web.insert(_el$2, solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return solid_js_web.memo(() => !!(store.option.showComment && delayType() === "end"))() && store.commentList?.length;
			},
			get children() {
				var _el$7 = _tmpl$$33();
				solid_js_web.addEventListener(_el$7, "wheel", stopPropagation);
				solid_js_web.insert(_el$7, solid_js_web.createComponent(solid_js.For, {
					get each() {
						return store.commentList;
					},
					children: (comment) => (() => {
						var _el$8 = _tmpl$3$2();
						solid_js_web.insert(_el$8, comment);
						return _el$8;
					})()
				}));
				solid_js_web.effect(() => solid_js_web.className(_el$7, \`\${classes$2.comments} \${classes$2.beautifyScrollbar}\`));
				return _el$7;
			}
		}), null);
		solid_js_web.effect((_p$) => {
			var _v$ = classes$2.endPage, _v$2 = store.show.endPage, _v$3 = delayType(), _v$4 = helper.boolDataVal(isDrag()), _v$5 = dir() === "rtl" ? "row-reverse" : void 0, _v$6 = classes$2.endPageBody, _v$7 = \`\${dragY()}px\`, _v$8 = classes$2.tip, _v$9 = { [classes$2.invisible]: !store.prop.onPrev }, _v$0 = store.show.endPage ? 0 : -1, _v$1 = store.show.endPage ? 0 : -1, _v$10 = { [classes$2.invisible]: !store.prop.onNext }, _v$11 = store.show.endPage ? 0 : -1;
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-show", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "data-type", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-drag", _p$.o = _v$4);
			_v$5 !== _p$.i && solid_js_web.setStyleProperty(_el$, "flex-direction", _p$.i = _v$5);
			_v$6 !== _p$.n && solid_js_web.className(_el$2, _p$.n = _v$6);
			_v$7 !== _p$.s && solid_js_web.setStyleProperty(_el$2, "--drag-y", _p$.s = _v$7);
			_v$8 !== _p$.h && solid_js_web.className(_el$3, _p$.h = _v$8);
			_p$.r = solid_js_web.classList(_el$4, _v$9, _p$.r);
			_v$0 !== _p$.d && solid_js_web.setAttribute(_el$4, "tabindex", _p$.d = _v$0);
			_v$1 !== _p$.l && solid_js_web.setAttribute(_el$5, "tabindex", _p$.l = _v$1);
			_p$.u = solid_js_web.classList(_el$6, _v$10, _p$.u);
			_v$11 !== _p$.c && solid_js_web.setAttribute(_el$6, "tabindex", _p$.c = _v$11);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0,
			s: void 0,
			h: void 0,
			r: void 0,
			d: void 0,
			l: void 0,
			u: void 0,
			c: void 0
		});
		return _el$;
	})();
};
//#endregion
//#region src/components/Manga/hooks/useHover.ts
const useHover = (ref) => {
	const [isHover, setIsHover] = solid_js.createSignal(false);
	const on = useEventListener(ref);
	on("mouseenter", () => setIsHover(true));
	on("mouseleave", (e) => {
		const el = ref();
		if (!el) return;
		const rect = el.getBoundingClientRect();
		if (!(helper.inRange(rect.left, e.clientX, rect.right) && helper.inRange(rect.top, e.clientY, rect.bottom))) setIsHover(false);
	});
	return isHover;
};
//#endregion
//#region src/components/Manga/components/ScrollbarPageStatus.tsx
var _tmpl$$32 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
const getScrollbarPage = (img, i, double = false) => {
	let num;
	if (store.option.scrollMode.enabled) num = getImg(i).size.height;
	else num = double ? 2 : 1;
	let upscale;
	if (isUpscale() && img.upscaleUrl !== void 0) upscale = img.upscaleUrl === "" ? "loading" : true;
	return {
		num,
		loadType: img.loadType,
		translationType: img.translationType,
		upscale
	};
};
const ScrollbarPage = (props) => (() => {
	var _el$ = _tmpl$$32();
	solid_js_web.effect((_p$) => {
		var _v$ = classes$2.scrollbarPage, _v$2 = \`\${props.num / scrollLength() * 100}%\`, _v$3 = props.loadType, _v$4 = props.translationType, _v$5 = props.upscale;
		_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
		_v$2 !== _p$.t && solid_js_web.setStyleProperty(_el$, "flex-basis", _p$.t = _v$2);
		_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "data-type", _p$.a = _v$3);
		_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-translation-type", _p$.o = _v$4);
		_v$5 !== _p$.i && solid_js_web.setAttribute(_el$, "data-upscale", _p$.i = _v$5);
		return _p$;
	}, {
		e: void 0,
		t: void 0,
		a: void 0,
		o: void 0,
		i: void 0
	});
	return _el$;
})();
const isSameItem = (a, b) => a.loadType === b.loadType && a.translationType === b.translationType && a.upscale === b.upscale;
/** 显示对应图片加载情况的元素 */
const ScrollbarPageStatus = () => {
	const scrollbarPageList = helper.createThrottleMemo(() => {
		if (store.pageList.length === 0) return [];
		const list = [];
		let item;
		const handleImg = (i, double = false) => {
			const img = getImg(i);
			const imgItem = getScrollbarPage(img, i, double);
			if (!item) {
				item = imgItem;
				return;
			}
			if (isSameItem(item, imgItem)) {
				if (store.option.scrollMode.enabled) item.num += img.size.height;
				else item.num += double ? 2 : 1;
			} else {
				list.push(item);
				item = getScrollbarPage(img, i, double);
			}
		};
		for (const [a, b] of store.pageList) if (b === void 0) handleImg(a, !isOnePageMode());
		else if (a === -1) {
			handleImg(b);
			handleImg(b);
		} else if (b === -1) {
			handleImg(a);
			handleImg(a);
		} else {
			handleImg(a);
			handleImg(b);
		}
		if (item) list.push(item);
		return list;
	}, 200);
	return solid_js_web.createComponent(solid_js.For, {
		get each() {
			return scrollbarPageList();
		},
		children: (page) => solid_js_web.createComponent(ScrollbarPage, page)
	});
};
//#endregion
//#region src/components/Manga/components/Scrollbar.tsx
var _tmpl$$31 = /*#__PURE__*/ solid_js_web.template(\`<div role=scrollbar tabindex=-1>\`);
var _tmpl$2$5 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
/** 滚动条 */
const Scrollbar = () => {
	solid_js.onMount(() => {
		helper.useDrag({
			ref: refs.scrollbar,
			handleDrag: handleScrollbarSlider,
			easyMode: () => isScrollMode() && store.option.scrollbar.easyScroll,
			setCapture: true
		});
		watchDomSize("scrollbarSize", refs.scrollbar);
	});
	const [penetrate, setPenetrate] = solid_js.createSignal(false);
	let penetrateFrame = 0;
	const handleWheel = () => {
		setPenetrate(true);
		cancelAnimationFrame(penetrateFrame);
		penetrateFrame = requestAnimationFrame(() => setPenetrate(false));
	};
	solid_js.onCleanup(() => cancelAnimationFrame(penetrateFrame));
	const isScrollbarHover = useHover(() => refs.scrollbar);
	solid_js.createEffect(() => setState("isScrollbarHover", isScrollbarHover()));
	/** 滚动条提示文本 */
	const tipText = helper.createThrottleMemo(() => {
		if (store.showRange[0] === store.showRange[1]) return getPageTip(store.showRange[0]);
		if (isDoubleMode()) {
			const rows = [];
			let pageIndex = 0;
			for (const row of scrollPageList()) {
				const start = pageIndex;
				const end = pageIndex + row.length - 1;
				pageIndex += row.length;
				if (store.showRange[1] < start || store.showRange[0] > end) continue;
				const rowTipList = row.map((_, i) => getPageTip(start + i));
				if (store.option.dir === "rtl") rowTipList.reverse();
				rows.push(rowTipList.join("   "));
			}
			return rows.join("\\n") || getPageTip(store.showRange[0]);
		}
		/** 并排卷轴模式下的滚动条提示文本 */
		if (isAbreastMode()) {
			const columns = abreastArea().columns.slice(abreastShowColumn().start, abreastShowColumn().end + 1).map((column) => column.map(getPageTip));
			if (store.option.dir !== "rtl") columns.reverse();
			return columns.map((column) => column.join(" ")).join("\\n");
		}
		const tipList = [];
		for (let [i] = store.showRange; i <= store.showRange[1]; i++) tipList.push(getPageTip(i));
		if (isOnePageMode()) return tipList.join("\\n");
		if (tipList.length === 1) return tipList[0];
		if (store.option.dir === "rtl") tipList.reverse();
		return tipList.join("   ");
	});
	css$1(\`.\${classes$2.scrollbar}\`, {
		"pointer-events": () => penetrate() || store.isDragMode ? "none" : "auto",
		"--scroll-length": () => \`\${scrollDomLength()}px\`,
		"--slider-midpoint": () => \`\${sliderMidpoint()}px\`,
		"--slider-height": () => \`\${sliderHeight() * scrollDomLength()}px\`,
		"--slider-top": sliderTop
	});
	const ScrollbarBase = (props) => (() => {
		var _el$ = _tmpl$$31();
		_el$.addEventListener("wheel", handleWheel);
		var _ref$ = props.ref;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$) : props.ref = _el$;
		solid_js_web.insert(_el$, () => props.children);
		solid_js_web.effect((_p$) => {
			var _v$ = classes$2.scrollbar, _v$2 = classes$2.mangaFlow, _v$3 = store.activePageIndex || -1, _v$4 = helper.boolDataVal(store.option.scrollbar.autoHidden), _v$5 = helper.boolDataVal(store.show.scrollbar || penetrate() || store.isScrollbarHover), _v$6 = store.option.dir, _v$7 = scrollPosition(), _v$8 = helper.boolDataVal(isAbreastMode()), _v$9 = helper.boolDataVal(isDrag()), _v$0 = props.style;
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "aria-controls", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "aria-valuenow", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-auto-hidden", _p$.o = _v$4);
			_v$5 !== _p$.i && solid_js_web.setAttribute(_el$, "data-force-show", _p$.i = _v$5);
			_v$6 !== _p$.n && solid_js_web.setAttribute(_el$, "data-dir", _p$.n = _v$6);
			_v$7 !== _p$.s && solid_js_web.setAttribute(_el$, "data-position", _p$.s = _v$7);
			_v$8 !== _p$.h && solid_js_web.setAttribute(_el$, "data-is-abreast-mode", _p$.h = _v$8);
			_v$9 !== _p$.r && solid_js_web.setAttribute(_el$, "data-drag", _p$.r = _v$9);
			_p$.d = solid_js_web.style(_el$, _v$0, _p$.d);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0,
			s: void 0,
			h: void 0,
			r: void 0,
			d: void 0
		});
		return _el$;
	})();
	return [solid_js_web.createComponent(ScrollbarBase, {
		ref(r$) {
			var _ref$2 = bindRef("scrollbar");
			typeof _ref$2 === "function" && _ref$2(r$);
		},
		get children() {
			return [(() => {
				var _el$2 = _tmpl$2$5();
				solid_js_web.insert(_el$2, tipText);
				solid_js_web.effect(() => solid_js_web.className(_el$2, classes$2.scrollbarPoper));
				return _el$2;
			})(), solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return solid_js_web.memo(() => !!store.option.scrollbar.showImgStatus)() && scrollPosition() !== "hidden";
				},
				get children() {
					return solid_js_web.createComponent(ScrollbarPageStatus, {});
				}
			})];
		}
	}), solid_js_web.createComponent(ScrollbarBase, {
		style: {
			"mix-blend-mode": "difference",
			"pointer-events": "none"
		},
		get children() {
			var _el$3 = _tmpl$2$5();
			solid_js_web.effect(() => solid_js_web.className(_el$3, classes$2.scrollbarSlider));
			return _el$3;
		}
	})];
};
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/close.svg
var _tmpl$$30 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4">\`);
var close_default = (props = {}) => (() => {
	var _el$ = _tmpl$$30();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/fullscreen.svg
var _tmpl$$29 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H7v-2c0-.55-.45-1-1-1m0-4c.55 0 1-.45 1-1V7h2c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1m11 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1zM14 6c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1">\`);
var fullscreen_default = (props = {}) => (() => {
	var _el$ = _tmpl$$29();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/fullscreen_exit.svg
var _tmpl$$28 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1m2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1m1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z">\`);
var fullscreen_exit_default = (props = {}) => (() => {
	var _el$ = _tmpl$$28();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/looks_one.svg
var _tmpl$$27 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-6 14c-.55 0-1-.45-1-1V9h-1c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1">\`);
var looks_one_default = (props = {}) => (() => {
	var _el$ = _tmpl$$27();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/looks_two.svg
var _tmpl$$26 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 8c0 1.1-.9 2-2 2h-2v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1v-3c0-1.1.9-2 2-2h2V9h-3c-.55 0-1-.45-1-1s.45-1 1-1h3c1.1 0 2 .9 2 2z">\`);
var looks_two_default = (props = {}) => (() => {
	var _el$ = _tmpl$$26();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/low_priority.svg
var _tmpl$$25 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M15 5h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1m0 5.5h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1m0 5.5h6c.55 0 1 .45 1 1s-.45 1-1 1h-6c-.55 0-1-.45-1-1s.45-1 1-1m-5.15 3.15 1.79-1.79c.2-.2.2-.51 0-.71l-1.79-1.79a.495.495 0 0 0-.85.35v3.59c0 .44.54.66.85.35M9 16h-.3c-2.35 0-4.45-1.71-4.68-4.05A4.51 4.51 0 0 1 8.5 7H11c.55 0 1-.45 1-1s-.45-1-1-1H8.5c-3.86 0-6.96 3.4-6.44 7.36C2.48 15.64 5.43 18 8.73 18H9">\`);
var low_priority_default = (props = {}) => (() => {
	var _el$ = _tmpl$$25();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/queue.svg
var _tmpl$$24 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1m17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-2 9h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3V6c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1">\`);
var queue_default = (props = {}) => (() => {
	var _el$ = _tmpl$$24();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/settings.svg
var _tmpl$$23 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5">\`);
var settings_default = (props = {}) => (() => {
	var _el$ = _tmpl$$23();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/translate.svg
var _tmpl$$22 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12.65 15.67c.14-.36.05-.77-.23-1.05l-2.09-2.06.03-.03A17.5 17.5 0 0 0 14.07 6h1.94c.54 0 .99-.45.99-.99v-.02c0-.54-.45-.99-.99-.99H10V3c0-.55-.45-1-1-1s-1 .45-1 1v1H1.99c-.54 0-.99.45-.99.99 0 .55.45.99.99.99h10.18A15.7 15.7 0 0 1 9 11.35c-.81-.89-1.49-1.86-2.06-2.88A.89.89 0 0 0 6.16 8c-.69 0-1.13.75-.79 1.35.63 1.13 1.4 2.21 2.3 3.21L3.3 16.87a.99.99 0 0 0 0 1.42c.39.39 1.02.39 1.42 0L9 14l2.02 2.02c.51.51 1.38.32 1.63-.35M17.5 10c-.6 0-1.14.37-1.35.94l-3.67 9.8c-.24.61.22 1.26.87 1.26.39 0 .74-.24.88-.61l.89-2.39h4.75l.9 2.39c.14.36.49.61.88.61.65 0 1.11-.65.88-1.26l-3.67-9.8c-.22-.57-.76-.94-1.36-.94m-1.62 7 1.62-4.33L19.12 17z">\`);
var translate_default = (props = {}) => (() => {
	var _el$ = _tmpl$$22();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/view_day.svg
var _tmpl$$21 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M3 21h17c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1M20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1M2 4v1c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1">\`);
var view_day_default = (props = {}) => (() => {
	var _el$ = _tmpl$$21();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/zoom_in.svg
var _tmpl$$20 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.78 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.26 4.25c.41.41 1.07.41 1.48 0l.01-.01c.41-.41.41-1.07 0-1.48zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14m0-7c-.28 0-.5.22-.5.5V9H7.5c-.28 0-.5.22-.5.5s.22.5.5.5H9v1.5c0 .28.22.5.5.5s.5-.22.5-.5V10h1.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H10V7.5c0-.28-.22-.5-.5-.5">\`);
var zoom_in_default = (props = {}) => (() => {
	var _el$ = _tmpl$$20();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/zoom_out.svg
var _tmpl$$19 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.26 4.25c.41.41 1.07.41 1.48 0l.01-.01c.41-.41.41-1.07 0-1.48zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14m-2-5h4c.28 0 .5.22.5.5s-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5s.22-.5.5-.5">\`);
var zoom_out_default = (props = {}) => (() => {
	var _el$ = _tmpl$$19();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/components/IconButton/index.module.css
const classes$1 = {
	"iconButtonItem": "iconButtonItem___vTPHz",
	"iconButton": "iconButton___dhWw3",
	"enabled": "enabled___eXH34",
	"disable": "disable___7C-Rj",
	"iconButtonPopper": "iconButtonPopper___dVIu-",
	"hidden": "hidden___v7N-q"
};
//#endregion
//#region src/components/IconButton/index.module.css?inline
var index_module_default$1 = ".iconButtonItem___vTPHz {\\n  position: relative;\\n  display: flex;\\n  align-items: center;\\n}\\n\\n.iconButton___dhWw3 {\\n  cursor: pointer;\\n\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n\\n  width: 1.5em;\\n  height: 1.5em;\\n  margin: 0.1em;\\n  padding: 0;\\n  border-style: none;\\n  border-radius: 9999px;\\n\\n  font-size: 1.5em;\\n  color: var(--text, white);\\n\\n  background-color: transparent;\\n  outline: none;\\n}\\n\\n.iconButton___dhWw3:focus,.iconButton___dhWw3:hover {\\n    background-color: var(--hover-bg-color, #fff3);\\n  }\\n\\n.iconButton___dhWw3.enabled___eXH34:not(.disable___7C-Rj) {\\n    color: var(--text-bg, #121212);\\n    background-color: var(--text, white);\\n  }\\n\\n.iconButton___dhWw3.enabled___eXH34:not(.disable___7C-Rj):focus,.iconButton___dhWw3.enabled___eXH34:not(.disable___7C-Rj):hover {\\n      background-color: var(--hover-bg-color-enable, #fffa);\\n    }\\n\\n.iconButton___dhWw3.disable___7C-Rj {\\n    cursor: not-allowed;\\n    opacity: 0.5;\\n    background-color: unset;\\n  }\\n\\n.iconButton___dhWw3 > svg {\\n    width: 1em;\\n  }\\n\\n/* 默认悬浮框样式 */\\n.iconButtonPopper___dVIu- {\\n  pointer-events: none;\\n  -webkit-user-select: none;\\n          user-select: none;\\n\\n  position: absolute;\\n  top: 50%;\\n  transform: translateY(-50%);\\n\\n  display: flex;\\n  align-items: center;\\n\\n  padding: 0.4em 0.5em;\\n  border-radius: 0.3em;\\n\\n  font-size: 0.8em;\\n  color: white;\\n  white-space: nowrap;\\n\\n  opacity: 0;\\n  background-color: #303030;\\n}\\n.iconButtonPopper___dVIu-[data-placement='right'] {\\n    left: calc(100% + 1.5em);\\n  }\\n.iconButtonPopper___dVIu-[data-placement='right']::before {\\n      right: calc(100% + 0.5em);\\n      border-right-color: var(--switch-bg, #6e6e6e);\\n      border-right-width: 0.5em;\\n    }\\n.iconButtonPopper___dVIu-[data-placement='left'] {\\n    right: calc(100% + 1.5em);\\n  }\\n.iconButtonPopper___dVIu-[data-placement='left']::before {\\n      left: calc(100% + 0.5em);\\n      border-left-color: var(--switch-bg, #6e6e6e);\\n      border-left-width: 0.5em;\\n    }\\n\\n/* 工具栏按钮的悬浮框的箭头 */\\n.iconButtonPopper___dVIu-::before {\\n  pointer-events: none;\\n  content: '';\\n\\n  position: absolute;\\n\\n  border-color: transparent;\\n  border-style: solid;\\n  border-width: 0.4em;\\n\\n  background-color: transparent;\\n\\n  transition: opacity 150ms;\\n}\\n\\n/* 控制悬浮框的显示 */\\n.iconButtonItem___vTPHz:is(:hover, :focus, [data-show='true']) .iconButtonPopper___dVIu- {\\n  opacity: 1;\\n}\\n\\n.hidden___v7N-q {\\n  display: none;\\n}\\n";
//#endregion
//#region src/components/IconButton/index.tsx
var _tmpl$$18 = /*#__PURE__*/ solid_js_web.template(\`<div><button type=button tabindex=0>\`);
var _tmpl$2$4 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
/** 图标按钮 */
const IconButton$1 = (_props) => {
	const props = solid_js.mergeProps({ placement: "right" }, _props);
	let buttonRef;
	const handleClick = (e) => {
		if (props.disable) return;
		props.onClick?.(e);
		buttonRef?.blur();
	};
	return (() => {
		var _el$ = _tmpl$$18(), _el$2 = _el$.firstChild;
		solid_js_web.use((ref) => helper.css(index_module_default$1, ref), _el$);
		solid_js_web.addEventListener(_el$2, "click", handleClick);
		var _ref$ = buttonRef;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$2) : buttonRef = _el$2;
		solid_js_web.insert(_el$2, () => props.children);
		solid_js_web.insert(_el$, (() => {
			var _c$ = solid_js_web.memo(() => !!(props.popper || props.tip));
			return () => _c$() ? (() => {
				var _el$3 = _tmpl$2$4();
				solid_js_web.insert(_el$3, () => props.popper || props.tip);
				solid_js_web.effect((_p$) => {
					var _v$7 = [classes$1.iconButtonPopper, props.popperClassName].join(" "), _v$8 = props.placement;
					_v$7 !== _p$.e && solid_js_web.className(_el$3, _p$.e = _v$7);
					_v$8 !== _p$.t && solid_js_web.setAttribute(_el$3, "data-placement", _p$.t = _v$8);
					return _p$;
				}, {
					e: void 0,
					t: void 0
				});
				return _el$3;
			})() : null;
		})(), null);
		solid_js_web.effect((_p$) => {
			var _v$ = classes$1.iconButtonItem, _v$2 = props.showTip, _v$3 = props.tip, _v$4 = classes$1.iconButton, _v$5 = props.style, _v$6 = {
				[classes$1.hidden]: props.hidden,
				[classes$1.enabled]: props.enabled,
				[classes$1.disable]: props.disable
			};
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-show", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$2, "aria-label", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.className(_el$2, _p$.o = _v$4);
			_p$.i = solid_js_web.style(_el$2, _v$5, _p$.i);
			_p$.n = solid_js_web.classList(_el$2, _v$6, _p$.n);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0
		});
		return _el$;
	})();
};
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/play_arrow.svg
var _tmpl$$17 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82">\`);
var play_arrow_default = (props = {}) => (() => {
	var _el$ = _tmpl$$17();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/stop.svg
var _tmpl$$16 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2">\`);
var stop_default = (props = {}) => (() => {
	var _el$ = _tmpl$$16();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/components/Manga/components/autoScroll.tsx
/** 自动滚动最低速度（px/ms），避免 distance 为 0 或异常配置导致卡住 */
const MIN_AUTO_SCROLL_SPEED = 10 / 1e3;
const autoScrollSpeed = () => {
	const { interval, distance } = store.option.autoScroll;
	if (interval <= 0 || distance <= 0) return MIN_AUTO_SCROLL_SPEED;
	return Math.max(MIN_AUTO_SCROLL_SPEED, distance / interval);
};
const autoScroll = new class extends helper.AnimationFrame {
	/** 上次滚动的时间 */
	lastTime = 0;
	scrollEnd = () => {
		this.stop();
		if (!store.prop.onExit) return;
		setState("show", "endPage", "end");
		if (store.option.autoScroll.triggerEnd) setTimeout(handleEndTurnPage, 500, "next");
	};
	scroll = () => {
		if (isBottom()) return this.scrollEnd();
		if (isScrollMode()) return scrollBy(Math.max(1, store.option.autoScroll.distance), true);
		return turnPageAnimation("next");
	};
	frame = (timestamp) => {
		const elapsed = timestamp - this.lastTime;
		let progress;
		if (elapsed >= store.option.autoScroll.interval) {
			this.lastTime = timestamp;
			this.scroll();
			progress = 1;
		}
		if (!store.autoScroll.play) return;
		progress ||= elapsed / store.option.autoScroll.interval;
		setState("autoScroll", "progress", progress);
		this.call(true);
	};
	start = () => {
		this.lastTime = 0;
		if (!store.option.autoScroll.continuous || !isScrollMode()) return this.call();
		constantScroll.start(autoScrollSpeed(), (delta) => {
			if (isBottom()) {
				this.scrollEnd();
				return false;
			}
			const { distance } = store.option.autoScroll;
			if (distance > 0) setState("autoScroll", "progress", (store.autoScroll.progress + delta / distance) % 1);
		});
	};
	stop = () => {
		this.cancel();
		constantScroll.cancel();
		setState("autoScroll", "play", false);
	};
}();
helper.createEffectOn(() => [
	...Object.values(store.option.autoScroll),
	store.autoScroll.play,
	isScrollMode()
], () => {
	autoScroll.cancel();
	constantScroll.cancel();
	if (!store.option.autoScroll.enabled || !store.autoScroll.play) return;
	autoScroll.start();
});
helper.createEffectOn(() => store.show.toolbar, (show) => show && autoScroll.stop());
const AutoScrollButton = () => {
	const background = solid_js.createMemo(() => {
		if (!store.autoScroll.play) return;
		const deg = store.autoScroll.progress * 360 % 360;
		return \`conic-gradient(var(--text-secondary) 0deg, var(--text-secondary) \${deg}deg, var(--text) \${deg}deg)\`;
	});
	return solid_js_web.createComponent(IconButton$1, {
		get tip() {
			return helper.t("button.auto_scroll");
		},
		get enabled() {
			return store.autoScroll.play;
		},
		get style() {
			return { background: background() };
		},
		onClick: switchAutoScroll,
		get children() {
			return solid_js_web.memo(() => !!store.autoScroll.play)() ? solid_js_web.createComponent(stop_default, {}) : solid_js_web.createComponent(play_arrow_default, {});
		}
	});
};
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/file_download.svg
var _tmpl$$15 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1">\`);
var file_download_default = (props = {}) => (() => {
	var _el$ = _tmpl$$15();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/components/Manga/components/DownloadButton.tsx
const getExtName = (mime) => /.+\\/(?<ext>[^;]+)/u.exec(mime)?.groups?.ext ?? "jpg";
/** 下载按钮 */
const DownloadButton = () => {
	const { store: state, setState } = helper.useStore({
		length: 0,
		/** undefined 表示未开始下载，等于 length 表示正在打包，-1 表示下载完成 */
		completedNum: void 0,
		errorNum: 0,
		rawTitle: document.title,
		showRawTitle: true
	});
	const progress = new helper.FaviconProgress();
	const handleDownload = async () => {
		const fileData = {};
		setState({
			errorNum: 0,
			length: imgList().length
		});
		if (state.showRawTitle) setState("rawTitle", document.title);
		const imgIndexNum = \`\${state.length}\`.length;
		for (let i = 0; i < state.length; i += 1) {
			setState("completedNum", i);
			const img = imgList()[i];
			if (store.option.translation.onlyDownloadTranslated && img.translationType !== "show") continue;
			let url;
			if (img.translationType === "show") url = img.translationUrl;
			else if (img.upscaleUrl && isUpscale()) url = img.upscaleUrl;
			else url = img.src;
			if (!url?.trim()) continue;
			let data;
			let fileName;
			const index = \`\${i}\`.padStart(imgIndexNum, "0");
			try {
				data = await downloadImg(url, void 0, 3);
				fileName = img.name || \`\${index}.\${getExtName(data.type)}\`;
			} catch {
				fileName = \`\${index} - \${helper.t("alert.download_failed")}\`;
				setState("errorNum", (num) => num + 1);
			}
			let name = fileName;
			for (let duplicate = 1; fileData[name]; duplicate += 1) name = \`\${fileName} (\${duplicate})\`;
			fileData[name] = new Uint8Array(await data?.arrayBuffer() ?? []);
		}
		if (Object.keys(fileData).length === 0) {
			components_Toast.toast.warn(helper.t("alert.no_img_download"));
			setState("completedNum", void 0);
			return;
		}
		setState("completedNum", state.length);
		const zipped = fflate.zipSync(fileData, {
			level: 0,
			comment: location.href
		});
		helper.saveAs(new Blob([zipped]), \`\${store.title || state.rawTitle}.zip\`);
		setState("completedNum", -1);
		components_Toast.toast(state.errorNum > 0 ? helper.t("button.download_completed_error", { errorNum: state.errorNum }) : helper.t("button.download_completed"), {
			type: state.errorNum > 0 ? "warn" : "success",
			onDismiss() {
				document.title = state.rawTitle;
				setState("showRawTitle", true);
				progress.recover();
			}
		});
	};
	const tip = solid_js.createMemo(() => {
		switch (state.completedNum) {
			case void 0: return helper.t("other.download");
			case state.length: return helper.t("button.packaging");
			case -1: return helper.t("button.download_completed");
			default: return \`\${helper.t("button.downloading")} - \${state.completedNum}/\${state.length}\`;
		}
	});
	helper.createEffectOn(() => state.completedNum, (num) => {
		let showTip = "";
		switch (num) {
			case void 0: return;
			case state.length:
				showTip = "📦";
				break;
			case -1:
				showTip = state.errorNum > 0 ? \`❗[\${state.errorNum}]\` : "✅";
				break;
			default: showTip = \`\${num}/\${state.length}\`;
		}
		document.title = \`\${showTip} - \${state.rawTitle}\`;
		setState("showRawTitle", false);
	}, { defer: true });
	helper.createEffectOn(() => state.completedNum, (num) => num && num > 0 && progress.update(num / state.length), { defer: true });
	return solid_js_web.createComponent(components_IconButton.IconButton, {
		get tip() {
			return tip();
		},
		onClick: handleDownload,
		get enabled() {
			return state.completedNum !== void 0;
		},
		get children() {
			return solid_js_web.createComponent(file_download_default, {});
		}
	});
};
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/format_textdirection_l_to_r.svg
var _tmpl$$14 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M9 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1H9.17C7.08 2 5.22 3.53 5.02 5.61A4 4 0 0 0 9 10m11.65 7.65-2.79-2.79a.501.501 0 0 0-.86.35V17H6c-.55 0-1 .45-1 1s.45 1 1 1h11v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7">\`);
var format_textdirection_l_to_r_default = (props = {}) => (() => {
	var _el$ = _tmpl$$14();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/format_textdirection_r_to_l.svg
var _tmpl$$13 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M10 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1h-6.83C8.08 2 6.22 3.53 6.02 5.61A4 4 0 0 0 10 10m-2 7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79a.5.5 0 0 0 .85-.36V19h11c.55 0 1-.45 1-1s-.45-1-1-1z">\`);
var format_textdirection_r_to_l_default = (props = {}) => (() => {
	var _el$ = _tmpl$$13();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/add.svg
var _tmpl$$12 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1">\`);
var add_default = (props = {}) => (() => {
	var _el$ = _tmpl$$12();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/refresh.svg
var _tmpl$$11 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71z">\`);
var refresh_default = (props = {}) => (() => {
	var _el$ = _tmpl$$11();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/components/Manga/components/SettingHotkeys.tsx
var _tmpl$$10 = /*#__PURE__*/ solid_js_web.template(\`<div tabindex=0>\`);
var _tmpl$2$3 = /*#__PURE__*/ solid_js_web.template(\`<div><div><p></p><span style=flex-grow:1></span><div></div><div>\`);
var _tmpl$3$1 = /*#__PURE__*/ solid_js_web.template(\`<div><select style=height:100%><option value disabled hidden selected> …\`);
var _tmpl$4 = /*#__PURE__*/ solid_js_web.template(\`<option>\`);
const setHotkeys = (...args) => {
	setState(...["hotkeys", ...args]);
	store.prop.onHotkeysChange?.(Object.fromEntries(Object.entries(store.hotkeys).filter(([name, keys]) => !helper.isEqual(keys.filter(Boolean), defaultHotkeys()[name]))));
};
const delHotkeys = (code) => {
	for (const [name, keys] of Object.entries(store.hotkeys)) {
		const i = keys.indexOf(code);
		if (i === -1) continue;
		const newKeys = [...store.hotkeys[name]];
		newKeys.splice(i, 1);
		setHotkeys(name, newKeys);
	}
};
const getHotkeyName = (code) => helper.t(\`hotkeys.\${code}\`) || helper.t(\`button.\${code}\`) || helper.t(\`setting.translation.\${code}\`) || helper.t(\`other.\${code}\`) || code;
const KeyItem = (props) => {
	const code = () => store.hotkeys[props.operateName][props.i];
	const del = () => delHotkeys(code());
	const handleKeyDown = (e) => {
		e.stopPropagation();
		e.preventDefault();
		switch (e.key) {
			case "Tab":
			case "Enter":
			case "Escape":
				focus();
				return;
			case "Backspace":
				setHotkeys(props.operateName, props.i, "");
				return;
		}
		const newCode = helper.getKeyboardCode(e);
		if (Reflect.has(hotkeysMap(), newCode)) components_Toast.toast.error(helper.t("hotkeys.repeat_tip", { hotkey: getHotkeyName(hotkeysMap()[newCode]) }));
		else setHotkeys(props.operateName, props.i, newCode);
	};
	return (() => {
		var _el$ = _tmpl$$10();
		_el$.addEventListener("blur", () => code() || del());
		solid_js_web.use((ref) => code() || setTimeout(() => ref.focus()), _el$);
		solid_js_web.addEventListener(_el$, "keydown", handleKeyDown);
		solid_js_web.insert(_el$, () => helper.keyboardCodeToText(code()), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(close_default, { "on:click": del }), null);
		solid_js_web.effect(() => solid_js_web.className(_el$, classes$2.hotkeysItem));
		return _el$;
	})();
};
const SettingHotkeys = (props) => solid_js_web.createComponent(solid_js.For, {
	get each() {
		return props.keys;
	},
	children: (name) => (() => {
		var _el$2 = _tmpl$2$3(), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$6 = _el$4.nextSibling.nextSibling, _el$7 = _el$6.nextSibling;
		solid_js_web.insert(_el$4, () => getHotkeyName(name));
		solid_js_web.addEventListener(_el$6, "click", () => setHotkeys(name, store.hotkeys[name].length, ""));
		solid_js_web.insert(_el$6, solid_js_web.createComponent(add_default, {}));
		solid_js_web.addEventListener(_el$7, "click", () => {
			const newKeys = defaultHotkeys()[name] ?? [];
			for (const code of defaultHotkeys()[name]) delHotkeys(code);
			setHotkeys(name, newKeys);
		});
		solid_js_web.insert(_el$7, solid_js_web.createComponent(refresh_default, {}));
		solid_js_web.insert(_el$2, solid_js_web.createComponent(solid_js.Index, {
			get each() {
				return store.hotkeys[name];
			},
			children: (_, i) => solid_js_web.createComponent(KeyItem, {
				operateName: name,
				i
			})
		}), null);
		solid_js_web.effect((_p$) => {
			var _v$ = classes$2.hotkeys, _v$2 = classes$2.hotkeysHeader, _v$3 = helper.t("setting.hotkeys.add"), _v$4 = helper.t("setting.hotkeys.restore");
			_v$ !== _p$.e && solid_js_web.className(_el$2, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.className(_el$3, _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$6, "title", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$7, "title", _p$.o = _v$4);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0
		});
		return _el$2;
	})()
});
const OtherHotkeys = (props) => {
	let ref;
	const handleChange = (e) => {
		const name = e.target.value;
		setHotkeys(name, store.hotkeys[name].length, "");
		ref.value = "";
	};
	return (() => {
		var _el$8 = _tmpl$3$1(), _el$9 = _el$8.firstChild, _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild;
		_el$9.addEventListener("change", handleChange);
		var _ref$ = ref;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$9) : ref = _el$9;
		solid_js_web.insert(_el$0, () => helper.t("other.other"), _el$1);
		solid_js_web.insert(_el$9, solid_js_web.createComponent(solid_js.For, {
			get each() {
				return props.keys;
			},
			children: (name) => (() => {
				var _el$10 = _tmpl$4();
				_el$10.value = name;
				solid_js_web.insert(_el$10, () => getHotkeyName(name));
				return _el$10;
			})()
		}), null);
		solid_js_web.effect((_p$) => {
			var _v$5 = classes$2.hotkeys, _v$6 = classes$2.hotkeysHeader;
			_v$5 !== _p$.e && solid_js_web.className(_el$8, _p$.e = _v$5);
			_v$6 !== _p$.t && solid_js_web.className(_el$9, _p$.t = _v$6);
			return _p$;
		}, {
			e: void 0,
			t: void 0
		});
		return _el$8;
	})();
};
const SettingHotkeysBlock = () => {
	const hotkeys = helper.createRootMemo(() => {
		const show = [];
		const other = [];
		for (const [name, keys] of Object.entries(store.hotkeys)) (keys.length > 0 ? show : other).push(name);
		return {
			show,
			other
		};
	});
	return [solid_js_web.createComponent(SettingHotkeys, { get keys() {
		return hotkeys().show;
	} }), solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return hotkeys().other.length;
		},
		get children() {
			return solid_js_web.createComponent(OtherHotkeys, { get keys() {
				return hotkeys().other;
			} });
		}
	})];
};
//#endregion
//#region src/components/Manga/components/SettingsItemButton.tsx
var _tmpl$$9 = /*#__PURE__*/ solid_js_web.template(\`<button type=button>\`);
/** 按钮式菜单项 */
const SettingsItemButton = (props) => {
	const [, others] = solid_js.splitProps(props, ["children", "onClick"]);
	return solid_js_web.createComponent(SettingsItem, solid_js_web.mergeProps(others, { get children() {
		var _el$ = _tmpl$$9();
		solid_js_web.addEventListener(_el$, "click", props.onClick);
		solid_js_web.insert(_el$, () => props.children);
		solid_js_web.effect(() => solid_js_web.className(_el$, classes$2.SettingsItemIconButton));
		return _el$;
	} }));
};
//#endregion
//#region src/components/Manga/components/SettingsShowItem.tsx
var _tmpl$$8 = /*#__PURE__*/ solid_js_web.template(\`<div><div>\`);
/** 带有动画过渡的切换显示设置项 */
const SettingsShowItem = (props) => (() => {
	var _el$ = _tmpl$$8(), _el$2 = _el$.firstChild;
	solid_js_web.insert(_el$2, () => props.children);
	solid_js_web.effect((_p$) => {
		var _v$ = classes$2.SettingsShowItem, _v$2 = props.when ? "1fr" : "0fr", _v$3 = classes$2.SettingsShowItemBody;
		_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
		_v$2 !== _p$.t && solid_js_web.setStyleProperty(_el$, "grid-template-rows", _p$.t = _v$2);
		_v$3 !== _p$.a && solid_js_web.className(_el$2, _p$.a = _v$3);
		return _p$;
	}, {
		e: void 0,
		t: void 0,
		a: void 0
	});
	return _el$;
})();
//#endregion
//#region src/components/RangeInput.tsx
var _tmpl$$7 = /*#__PURE__*/ solid_js_web.template(\`<textarea autocomplete=off rows=2>\`);
/** 范围输入框 */
const RangeInput = (props) => {
	let ref;
	/** 在保持光标位置不变的情况下修改文本 */
	const editText = (text) => {
		const offset = ref.selectionStart;
		ref.value = text;
		if (offset) requestAnimationFrame(() => {
			ref.selectionStart = offset;
			ref.selectionEnd = offset;
		});
	};
	/** 修改文本中的数字 */
	const replaceTextNumer = (text, offset, fn) => {
		const isNumber = (num) => /\\d/u.test(text[num]);
		let start = offset;
		if (!isNumber(offset)) {
			if (isNumber(start - 1)) start--;
			else if (isNumber(start + 1)) start++;
			else return text;
		}
		let end = start;
		while (isNumber(start - 1)) start--;
		while (isNumber(end + 1)) end++;
		return text.slice(0, start) + fn(Number(text.slice(start, end + 1))) + text.slice(end + 1);
	};
	const handleKeyDown = (e) => {
		switch (e.key) {
			case "ArrowUp":
			case "ArrowDown": editText(replaceTextNumer(ref.value, ref.selectionStart, (num) => e.key === "ArrowUp" ? num + 1 : num - 1));
		}
	};
	return (() => {
		var _el$ = _tmpl$$7();
		_el$.addEventListener("blur", () => {
			try {
				props.onChange?.(ref.value);
			} finally {
				ref.value = props.value;
			}
		});
		solid_js_web.addEventListener(_el$, "keydown", handleKeyDown);
		var _ref$ = ref;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$) : ref = _el$;
		solid_js_web.effect((_p$) => {
			var _v$ = props.style, _v$2 = props.placeholder;
			_p$.e = solid_js_web.style(_el$, _v$, _p$.e);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "placeholder", _p$.t = _v$2);
			return _p$;
		}, {
			e: void 0,
			t: void 0
		});
		solid_js_web.effect(() => _el$.value = props.value);
		return _el$;
	})();
};
//#endregion
//#region src/components/Manga/components/SettingTranslation.tsx
var _tmpl$$6 = /*#__PURE__*/ solid_js_web.template(\`<hr style="margin:1em 0">\`);
const bindOption$1 = (...args) => bindOption("translation", ...args);
const [rangeText, setRangeText] = solid_js.createSignal("");
helper.createEffectOn(translationImgs, (imgs) => setRangeText(helper.descRange(imgs, store.imgList.length)));
const TranslateRange = () => {
	helper.createEffectOn(rangeText, () => {
		const imgImgs = helper.extractRange(rangeText(), store.imgList.length);
		const openImgs = [...imgImgs].filter((i) => {
			switch (imgList()[i].translationType) {
				case "show":
				case "wait": return false;
				default: return true;
			}
		});
		if (openImgs.length > 0) setImgTranslationEnbale(openImgs, true);
		const closeImgs = /* @__PURE__ */ new Set();
		for (let i = 0; i < store.imgList.length; i++) if (!imgImgs.has(i)) closeImgs.add(i);
		if (closeImgs.size > 0) setImgTranslationEnbale(closeImgs, false);
		setRangeText(helper.descRange(imgImgs, store.imgList.length));
	});
	return [solid_js_web.createComponent(SettingsItem, { get name() {
		return helper.t("setting.translation.range");
	} }), solid_js_web.createComponent(RangeInput, {
		get ["class"]() {
			return classes$2.SettingsItem;
		},
		get placeholder() {
			return helper.t("other.page_range");
		},
		get value() {
			return rangeText();
		},
		onChange: setRangeText
	})];
};
const settingsMap = {
	"manga-image-translator": mitSettings,
	cotrans: cotransSettings
};
const SettingTranslation = () => [solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
	return helper.t("other.enabled");
} }, () => bindOption$1("enabled"))), solid_js_web.createComponent(solid_js.Show, {
	get when() {
		return store.option.translation.enabled;
	},
	get children() {
		return [
			solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
				get name() {
					return helper.t("setting.translation.provider");
				},
				options: [["manga-image-translator", "Manga Image Translator"], ["cotrans", "Cotrans"]]
			}, () => bindOption$1("provider"))),
			solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return allowBatchTranslation();
				},
				get children() {
					return [
						solid_js_web.createComponent(SettingsItemSwitch, {
							get name() {
								return helper.t("setting.translation.translate_all");
							},
							get value() {
								return isTranslatingAll();
							},
							onChange: translateAll
						}),
						solid_js_web.createComponent(SettingsItemSwitch, {
							get name() {
								return helper.t("setting.translation.translate_to_end");
							},
							get value() {
								return isTranslatingToEnd();
							},
							onChange: translateToEnd
						}),
						solid_js_web.createComponent(TranslateRange, {}),
						_tmpl$$6()
					];
				}
			}),
			solid_js_web.createComponent(solid_js_web.Dynamic, { get component() {
				return settingsMap[store.option.translation.provider];
			} }),
			_tmpl$$6(),
			solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
				return helper.t("setting.translation.options.force_retry");
			} }, () => bindOption$1("forceRetry"))),
			solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
				return helper.t("setting.translation.options.only_download_translated");
			} }, () => bindOption$1("onlyDownloadTranslated")))
		];
	}
})];
//#endregion
//#region src/components/Manga/defaultSettingList.tsx
var _tmpl$$5 = /*#__PURE__*/ solid_js_web.template(\`<input type=color style=width:2em;margin-right:.4em>\`);
var _tmpl$2$2 = /*#__PURE__*/ solid_js_web.template(\`<blockquote><p>\`);
/** 默认菜单项 */
const defaultSettingList = () => [
	[
		helper.t("setting.option.paragraph_dir"),
		() => solid_js_web.createComponent(SettingsItemButton, {
			get name() {
				return solid_js_web.memo(() => store.option.dir === "rtl")() ? helper.t("setting.option.dir_rtl") : helper.t("setting.option.dir_ltr");
			},
			onClick: switchDir,
			get children() {
				return solid_js_web.memo(() => store.option.dir === "rtl")() ? solid_js_web.createComponent(format_textdirection_r_to_l_default, {}) : solid_js_web.createComponent(format_textdirection_l_to_r_default, {});
			}
		}),
		{ initShow: true }
	],
	[
		helper.t("setting.option.paragraph_display"),
		() => [
			solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return !store.option.scrollMode.enabled;
				},
				get children() {
					return [solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
						return helper.t("setting.option.disable_auto_enlarge");
					} }, () => bindOption("disableZoom"))), solid_js_web.createComponent(SettingsItemNumber, {
						get name() {
							return helper.t("setting.option.zoom");
						},
						maxLength: 3,
						suffix: "%",
						step: 5,
						onChange: (val) => Number.isNaN(val) || zoom(val),
						get value() {
							return Math.round(store.option.zoom.ratio);
						}
					})];
				}
			}),
			solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return store.option.scrollMode.enabled;
				},
				get children() {
					return [
						solid_js_web.createComponent(SettingsItemSwitch, {
							get name() {
								return helper.t("setting.option.abreast_mode");
							},
							get value() {
								return store.option.scrollMode.abreastMode;
							},
							onChange: (val) => {
								const jump = saveScrollProgress();
								setOption((draftOption) => {
									draftOption.scrollMode.abreastMode = val;
									draftOption.scrollMode.doubleMode = false;
								});
								jump();
							}
						}),
						solid_js_web.createComponent(solid_js.Show, {
							get when() {
								return store.option.scrollMode.abreastMode;
							},
							get children() {
								return solid_js_web.createComponent(SettingsItemNumber, {
									get name() {
										return helper.t("setting.option.abreast_duplicate");
									},
									maxLength: 3,
									suffix: "%",
									step: 5,
									onChange: (val) => {
										if (Number.isNaN(val)) return;
										const newVal = helper.clamp(0, val / 100, .95);
										setOption("scrollMode", "abreastDuplicate", newVal);
									},
									get value() {
										return Math.round(store.option.scrollMode.abreastDuplicate * 100);
									}
								});
							}
						}),
						solid_js_web.createComponent(solid_js.Show, {
							get when() {
								return !store.option.scrollMode.abreastMode;
							},
							get children() {
								return [solid_js_web.createComponent(SettingsItemSelect, {
									get name() {
										return helper.t("setting.option.adjust_to_width");
									},
									get options() {
										return [
											["disable", helper.t("other.disable")],
											["full", helper.t("setting.option.full_width")],
											["custom", helper.t("other.custom")]
										];
									},
									get value() {
										return solid_js_web.memo(() => typeof store.option.scrollMode.adjustToWidth === "number")() ? "custom" : store.option.scrollMode.adjustToWidth;
									},
									onChange: (val) => {
										const jump = saveScrollProgress();
										let newVal;
										if (val === "custom") newVal = store.isMobile ? store.rootSize.width : 1280;
										else newVal = val;
										setOption("scrollMode", "adjustToWidth", newVal);
										jump();
									}
								}), solid_js_web.createComponent(solid_js.Show, {
									get when() {
										return isUseAutoScale();
									},
									get children() {
										return solid_js_web.createComponent(SettingsItemNumber, {
											get name() {
												return helper.t("setting.option.adjust_to_width");
											},
											maxLength: 6,
											step: 100,
											onChange: setAdjustToWidth,
											get value() {
												return store.option.scrollMode.adjustToWidth;
											}
										});
									}
								})];
							}
						}),
						solid_js_web.createComponent(solid_js.Show, {
							get when() {
								return store.option.scrollMode.adjustToWidth === "disable";
							},
							get children() {
								return solid_js_web.createComponent(SettingsItemNumber, {
									get name() {
										return helper.t("setting.option.scroll_mode_img_scale");
									},
									maxLength: 3,
									suffix: "%",
									step: 5,
									onChange: (val) => setImgScale(val / 100),
									get value() {
										return Math.round(store.option.scrollMode.imgScale * 100);
									}
								});
							}
						}),
						solid_js_web.createComponent(SettingsItemNumber, {
							get name() {
								return helper.t("setting.option.scroll_mode_img_spacing");
							},
							maxLength: 5,
							onChange: (val) => {
								if (Number.isNaN(val)) return;
								setOption("scrollMode", "spacing", helper.clamp(0, val, Infinity));
							},
							get value() {
								return Math.round(store.option.scrollMode.spacing);
							}
						})
					];
				}
			}),
			solid_js_web.createComponent(SettingsItemSelect, {
				get name() {
					return helper.t("setting.option.page_tip");
				},
				get options() {
					return [
						["hide", helper.t("setting.option.page_tip_hide")],
						["always", helper.t("setting.option.page_tip_always")],
						["auto", helper.t("setting.option.page_tip_auto")]
					];
				},
				get value() {
					return store.option.pageTip;
				},
				onChange: (val) => setOption("pageTip", val)
			}),
			solid_js_web.createComponent(SettingsItemNumber, {
				get name() {
					return helper.t("setting.option.img_filter_brightness");
				},
				maxLength: 3,
				suffix: "%",
				step: 5,
				onChange: (val) => {
					if (Number.isNaN(val)) return;
					setOption("imgFilter", "brightness", helper.clamp(0, val, 200));
				},
				get value() {
					return store.option.imgFilter.brightness;
				}
			}),
			solid_js_web.createComponent(SettingsItemNumber, {
				get name() {
					return helper.t("setting.option.img_filter_contrast");
				},
				maxLength: 3,
				suffix: "%",
				step: 5,
				onChange: (val) => {
					if (Number.isNaN(val)) return;
					setOption("imgFilter", "contrast", helper.clamp(0, val, 200));
				},
				get value() {
					return store.option.imgFilter.contrast;
				}
			}),
			solid_js_web.createComponent(SettingsItemNumber, {
				get name() {
					return helper.t("setting.option.img_filter_saturate");
				},
				maxLength: 3,
				suffix: "%",
				step: 5,
				onChange: (val) => {
					if (Number.isNaN(val)) return;
					setOption("imgFilter", "saturate", helper.clamp(0, val, 200));
				},
				get value() {
					return store.option.imgFilter.saturate;
				}
			}),
			solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return isDoubleMode();
				},
				get children() {
					return solid_js_web.createComponent(SettingsItemNumber, {
						get name() {
							return helper.t("setting.option.page_columns");
						},
						maxLength: 1,
						step: 1,
						onChange: (val) => {
							if (Number.isNaN(val)) return;
							const jump = saveScrollProgress();
							setOption("scrollMode", "pageColumns", helper.clamp(1, val, 6));
							jump();
						},
						get value() {
							return store.option.scrollMode.pageColumns;
						}
					});
				}
			})
		],
		{ initShow: true }
	],
	[
		helper.t("button.scroll_mode"),
		() => [solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.align_edge");
		} }, () => bindOption("scrollMode", "alignEdge"))), solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.scrollbar_easy_scroll");
		} }, () => bindOption("scrollbar", "easyScroll")))],
		{
			initShow: () => isScrollMode(),
			hidden: () => !isScrollMode()
		}
	],
	[helper.t("setting.option.paragraph_appearance"), () => [
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.dark_mode");
		} }, () => bindOption("darkMode"))),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.dark_mode_auto");
		} }, () => bindOption("autoDarkMode"))),
		solid_js_web.createComponent(SettingsItemNumber, {
			get name() {
				return helper.t("setting.option.turn_page_animation_duration");
			},
			maxLength: 4,
			suffix: "ms",
			step: 50,
			onChange: (val) => {
				if (Number.isNaN(val)) return;
				setOption("turnPageDuration", helper.clamp(0, val, 2e3));
			},
			get value() {
				return store.option.turnPageDuration;
			}
		}),
		solid_js_web.createComponent(SettingsItemNumber, {
			get name() {
				return helper.t("setting.option.scroll_animation_duration");
			},
			maxLength: 4,
			suffix: "ms",
			step: 50,
			onChange: (val) => {
				if (Number.isNaN(val)) return;
				setOption("scrollDuration", helper.clamp(0, val, 2e3));
			},
			get value() {
				return store.option.scrollDuration;
			}
		}),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.show_comments");
		} }, () => bindOption("showComment"))),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.autoHiddenMouse");
		} }, () => bindOption("autoHiddenMouse"))),
		solid_js_web.createComponent(SettingsItem, {
			get name() {
				return helper.t("setting.option.background_color");
			},
			get children() {
				var _el$ = _tmpl$$5();
				solid_js_web.addEventListener(_el$, "input", helper.throttle((e) => {
					if (!e.target.value) return;
					setOption((draftOption) => {
						draftOption.customBackground = e.target.value === "#000000" || e.target.value === "#ffffff" ? void 0 : e.target.value;
						if (draftOption.customBackground) draftOption.darkMode = helper.needDarkMode(draftOption.customBackground);
					});
				}, 20));
				solid_js_web.effect(() => _el$.value = store.option.customBackground ?? (store.option.darkMode ? "#000000" : "#ffffff"));
				return _el$;
			}
		}),
		solid_js_web.createComponent(SettingsItemSelect, {
			get name() {
				return helper.t("setting.language");
			},
			options: [
				["zh", "中文"],
				["en", "English"],
				["ru", "Русский"]
			],
			get value() {
				return helper.lang();
			},
			onChange: helper.setLang
		})
	]],
	[helper.t("setting.option.paragraph_scrollbar"), () => [solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
		get name() {
			return helper.t("setting.option.scrollbar_position");
		},
		get options() {
			return [
				["auto", helper.t("other.auto")],
				["right", helper.t("setting.option.scrollbar_position_right")],
				["top", helper.t("setting.option.scrollbar_position_top")],
				["bottom", helper.t("setting.option.scrollbar_position_bottom")],
				["hidden", helper.t("setting.option.scrollbar_position_hidden")]
			];
		}
	}, () => bindOption("scrollbar", "position"))), solid_js_web.createComponent(SettingsShowItem, {
		get when() {
			return store.option.scrollbar.position !== "hidden";
		},
		get children() {
			return [solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return !store.isMobile;
				},
				get children() {
					return solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
						return helper.t("setting.option.scrollbar_auto_hidden");
					} }, () => bindOption("scrollbar", "autoHidden")));
				}
			}), solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
				return helper.t("setting.option.scrollbar_show_img_status");
			} }, () => bindOption("scrollbar", "showImgStatus")))];
		}
	})]],
	[helper.t("setting.option.click_page_turn_enabled"), () => [
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("other.enabled");
		} }, () => bindOption("clickPageTurn", "enabled"))),
		solid_js_web.createComponent(SettingsItemSwitch, {
			get name() {
				return helper.t("setting.option.show_clickable_area");
			},
			get value() {
				return store.show.touchArea;
			},
			onChange: () => setState("show", "touchArea", !store.show.touchArea)
		}),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.shrink_menu");
		} }, () => bindOption("clickPageTurn", "shrinkMenu"))),
		solid_js_web.createComponent(SettingsShowItem, {
			get when() {
				return store.option.clickPageTurn.enabled;
			},
			get children() {
				return [solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
					get name() {
						return helper.t("setting.option.click_page_turn_area");
					},
					get options() {
						return Object.keys(areaArrayMap).map((key) => [key, helper.t(\`touch_area.type.\${key}\`)]);
					}
				}, () => bindOption("clickPageTurn", "area"))), solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
					return helper.t("setting.option.click_page_turn_swap_area");
				} }, () => bindOption("clickPageTurn", "reverse")))];
			}
		})
	]],
	[helper.t("button.auto_scroll"), () => [
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("other.enabled");
		} }, () => bindOption("autoScroll", "enabled"))),
		solid_js_web.createComponent(SettingsItemNumber, {
			get name() {
				return helper.t("other.interval");
			},
			maxLength: 3,
			suffix: "s",
			step: 1,
			onChange: (val) => {
				if (!Number.isNaN(val)) setState("option", "autoScroll", "interval", Math.max(1, val) * 1e3);
			},
			get value() {
				return store.option.autoScroll.interval / 1e3;
			}
		}),
		solid_js_web.createComponent(SettingsItemNumber, {
			get name() {
				return helper.t("other.distance");
			},
			maxLength: 3,
			suffix: "px",
			step: 20,
			onChange: (val) => {
				if (!Number.isNaN(val)) setState("option", "autoScroll", "distance", Math.max(1, val));
			},
			get value() {
				return store.option.autoScroll.distance;
			}
		}),
		solid_js_web.createComponent(SettingsShowItem, {
			get when() {
				return isScrollMode();
			},
			get children() {
				return solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
					return helper.t("setting.option.auto_scroll_continuous");
				} }, () => bindOption("autoScroll", "continuous")));
			}
		}),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.auto_scroll_trigger_end");
		} }, () => bindOption("autoScroll", "triggerEnd")))
	]],
	[helper.t("setting.option.img_recognition"), () => [
		solid_js_web.createComponent(SettingsItemSwitch, {
			get name() {
				return helper.t("other.enabled");
			},
			get value() {
				return store.option.imgRecognition.enabled;
			},
			onChange: () => switchImgRecognition("enabled")
		}),
		solid_js_web.createComponent(solid_js.Show, {
			when: typeof Worker === "undefined",
			get children() {
				var _el$2 = _tmpl$2$2(), _el$3 = _el$2.firstChild;
				solid_js_web.effect(() => _el$3.innerHTML = helper.t("setting.option.img_recognition_warn"));
				return _el$2;
			}
		}),
		solid_js_web.createComponent(solid_js.Show, {
			when: !userscript_supportWorker.supportWorker,
			get children() {
				var _el$4 = _tmpl$2$2(), _el$5 = _el$4.firstChild;
				solid_js_web.effect(() => _el$5.innerHTML = helper.t("setting.option.img_recognition_warn_2"));
				return _el$4;
			}
		}),
		solid_js_web.createComponent(SettingsItemSwitch, {
			get name() {
				return helper.t("setting.option.img_recognition_background");
			},
			get disabled() {
				return !store.option.imgRecognition.enabled;
			},
			get value() {
				return store.option.imgRecognition.background;
			},
			onChange: () => switchImgRecognition("background")
		}),
		solid_js_web.createComponent(SettingsItemSwitch, {
			get name() {
				return helper.t("setting.option.img_recognition_pageFill");
			},
			get disabled() {
				return !store.option.imgRecognition.enabled;
			},
			get value() {
				return store.option.imgRecognition.pageFill;
			},
			onChange: () => switchImgRecognition("pageFill")
		}),
		solid_js_web.createComponent(SettingsItemSwitch, {
			get name() {
				return helper.t("setting.option.img_recognition_crop");
			},
			get disabled() {
				return !store.option.imgRecognition.enabled;
			},
			get value() {
				return store.option.imgRecognition.crop;
			},
			onChange: () => switchImgRecognition("crop")
		}),
		solid_js_web.createComponent(SettingsItemNumber, {
			get name() {
				return helper.t("setting.option.img_recognition_keepMargin");
			},
			get disabled() {
				return !store.option.imgRecognition.enabled;
			},
			maxLength: 4,
			suffix: "px",
			step: 1,
			onChange: (val) => setOption("imgRecognition", "keepMargin", Math.max(0, Math.round(val))),
			get value() {
				return store.option.imgRecognition.keepMargin;
			}
		}),
		solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return !store.isMobile;
			},
			get children() {
				return solid_js_web.createComponent(SettingsItemSwitch, {
					get name() {
						return helper.t("upscale.title");
					},
					get disabled() {
						return !store.option.imgRecognition.enabled || !store.supportUpscaleImage;
					},
					get value() {
						return store.option.imgRecognition.upscale;
					},
					onChange: () => switchImgRecognition("upscale")
				});
			}
		})
	]],
	[helper.t("setting.option.paragraph_translation"), SettingTranslation],
	[helper.t("other.hotkeys"), SettingHotkeysBlock],
	[helper.t("other.other"), () => [
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.first_page_fill");
		} }, () => bindOption("firstPageFill"))),
		solid_js_web.createComponent(SettingsItemSwitch, {
			get name() {
				return helper.t("setting.option.auto_switch_page_mode");
			},
			get value() {
				return store.option.autoSwitchPageMode;
			},
			onChange: (val) => {
				setOption((draftOption, state) => {
					draftOption.autoSwitchPageMode = val;
					state.option.pageNum = val ? 0 : autoPageNum();
				});
			}
		}),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.swap_page_turn_key");
		} }, () => bindOption("swapPageTurnKey"))),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.autoFullscreen");
		} }, () => bindOption("autoFullscreen"))),
		solid_js_web.createComponent(SettingsItemSelect, solid_js_web.mergeProps({
			get name() {
				return helper.t("setting.option.scroll_end");
			},
			get options() {
				return [
					["none", helper.t("other.none")],
					["exit", helper.t("other.exit")],
					["auto", helper.t("setting.option.scroll_end_auto")]
				];
			}
		}, () => bindOption("scroolEnd"))),
		solid_js_web.createComponent(SettingsItemSwitch, solid_js_web.mergeProps({ get name() {
			return helper.t("setting.option.always_load_all_img");
		} }, () => bindOption("alwaysLoadAllImg"))),
		solid_js_web.createComponent(SettingsItemNumber, {
			get name() {
				return helper.t("setting.option.preload_page_num");
			},
			maxLength: 5,
			onChange: (val) => {
				if (Number.isNaN(val)) return;
				setOption("preloadPageNum", helper.clamp(0, val, 99999));
			},
			get value() {
				return store.option.preloadPageNum;
			}
		})
	]]
];
//#endregion
//#region src/components/Manga/components/SettingPanel.tsx
var _tmpl$$4 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
var _tmpl$2$1 = /*#__PURE__*/ solid_js_web.template(\`<div><div>\`);
var _tmpl$3 = /*#__PURE__*/ solid_js_web.template(\`<hr>\`);
const SettingBlockSubtitle = (props) => (() => {
	var _el$ = _tmpl$$4();
	solid_js_web.addEventListener(_el$, "click", props.onClick);
	solid_js_web.insert(_el$, () => props.children);
	solid_js_web.effect(() => solid_js_web.className(_el$, classes$2.SettingBlockSubtitle));
	return _el$;
})();
/** 菜单面板 */
const SettingPanel = () => (() => {
	var _el$2 = _tmpl$$4();
	solid_js_web.addEventListener(_el$2, "click", stopPropagation);
	solid_js_web.addEventListener(_el$2, "scroll", stopPropagation);
	_el$2.addEventListener("wheel", (e) => refs.settingPanel.scrollHeight > refs.settingPanel.clientHeight && e.stopPropagation());
	var _ref$ = bindRef("settingPanel");
	typeof _ref$ === "function" && solid_js_web.use(_ref$, _el$2);
	solid_js_web.insert(_el$2, solid_js_web.createComponent(solid_js.For, {
		get each() {
			return store.prop.editSettingList(defaultSettingList());
		},
		children: ([name, SettingItem, options], i) => {
			const initShow = options?.initShow;
			const [show, setShwo] = solid_js.createSignal(Boolean(initShow));
			if (typeof initShow === "function") helper.createEffectOn(initShow, (val) => setShwo(val));
			return solid_js_web.createComponent(solid_js.Show, {
				get when() {
					return solid_js_web.memo(() => !!options?.hidden)() ? !options.hidden() : true;
				},
				get children() {
					return [solid_js_web.memo(() => solid_js_web.memo(() => !!i())() ? _tmpl$3() : null), (() => {
						var _el$3 = _tmpl$2$1(), _el$4 = _el$3.firstChild;
						solid_js_web.insert(_el$3, solid_js_web.createComponent(SettingBlockSubtitle, {
							onClick: () => setShwo((prev) => !prev),
							get children() {
								return [name, solid_js_web.memo(() => show() ? null : "…")];
							}
						}), _el$4);
						solid_js_web.insert(_el$4, solid_js_web.createComponent(SettingItem, {}));
						solid_js_web.effect((_p$) => {
							var _v$3 = classes$2.SettingBlock, _v$4 = show(), _v$5 = classes$2.SettingBlockBody;
							_v$3 !== _p$.e && solid_js_web.className(_el$3, _p$.e = _v$3);
							_v$4 !== _p$.t && solid_js_web.setAttribute(_el$3, "data-show", _p$.t = _v$4);
							_v$5 !== _p$.a && solid_js_web.className(_el$4, _p$.a = _v$5);
							return _p$;
						}, {
							e: void 0,
							t: void 0,
							a: void 0
						});
						return _el$3;
					})()];
				}
			});
		}
	}));
	solid_js_web.effect((_p$) => {
		var _v$ = \`\${classes$2.SettingPanel} \${classes$2.beautifyScrollbar}\`, _v$2 = helper.lang() === "zh" ? "15em" : "20em";
		_v$ !== _p$.e && solid_js_web.className(_el$2, _p$.e = _v$);
		_v$2 !== _p$.t && solid_js_web.setStyleProperty(_el$2, "width", _p$.t = _v$2);
		return _p$;
	}, {
		e: void 0,
		t: void 0
	});
	return _el$2;
})();
//#endregion
//#region src/components/Manga/defaultButtonList.tsx
var _tmpl$$3 = /*#__PURE__*/ solid_js_web.template(\`<hr>\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<div role=button tabindex=-1>\`);
const ZoomButton = () => solid_js_web.createComponent(IconButton$1, {
	get tip() {
		return solid_js_web.memo(() => store.option.zoom.ratio === 100)() ? helper.t("button.zoom_in") : helper.t("button.zoom_out");
	},
	get enabled() {
		return store.option.zoom.ratio !== 100;
	},
	onClick: () => doubleClickZoom(),
	get children() {
		return solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return store.option.zoom.ratio === 100;
			},
			get fallback() {
				return solid_js_web.createComponent(zoom_out_default, {});
			},
			get children() {
				return solid_js_web.createComponent(zoom_in_default, {});
			}
		});
	}
});
/** 工具栏的默认按钮列表 */
const defaultButtonList = [
	() => solid_js_web.createComponent(IconButton$1, {
		get tip() {
			return solid_js_web.memo(() => !!isOnePageMode())() ? helper.t("button.page_mode_single") : helper.t("button.page_mode_double");
		},
		get hidden() {
			return store.isMobile;
		},
		onClick: switchOnePageMode,
		get children() {
			return solid_js_web.memo(() => !!isOnePageMode())() ? solid_js_web.createComponent(looks_one_default, {}) : solid_js_web.createComponent(looks_two_default, {});
		}
	}),
	() => solid_js_web.createComponent(IconButton$1, {
		get tip() {
			return helper.t("button.scroll_mode");
		},
		get enabled() {
			return store.option.scrollMode.enabled;
		},
		onClick: switchScrollMode,
		get children() {
			return solid_js_web.createComponent(view_day_default, {});
		}
	}),
	() => solid_js_web.createComponent(IconButton$1, {
		get tip() {
			return helper.t("button.page_fill");
		},
		get enabled() {
			return Boolean(store.fillEffect[nowFillIndex()]);
		},
		get hidden() {
			return isOnePageMode();
		},
		onClick: switchFillEffect,
		get children() {
			return solid_js_web.createComponent(queue_default, {});
		}
	}),
	() => solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return store.option.translation.enabled;
		},
		get children() {
			return [
				_tmpl$$3(),
				solid_js_web.createComponent(IconButton$1, {
					get tip() {
						return solid_js_web.memo(() => !!isTranslatingImage())() ? helper.t("button.close_current_page_translation") : helper.t("button.translate_current_page");
					},
					get enabled() {
						return isTranslatingImage();
					},
					onClick: translateCurrent,
					get children() {
						return solid_js_web.createComponent(translate_default, {});
					}
				}),
				solid_js_web.createComponent(IconButton$1, {
					get tip() {
						return helper.t("setting.translation.translate_to_end");
					},
					get enabled() {
						return isTranslatingToEnd();
					},
					get hidden() {
						return !allowBatchTranslation();
					},
					onClick: translateToEnd,
					get children() {
						return solid_js_web.createComponent(low_priority_default, {});
					}
				})
			];
		}
	}),
	() => solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return store.option.autoScroll.enabled;
		},
		get children() {
			return [_tmpl$$3(), solid_js_web.createComponent(AutoScrollButton, {})];
		}
	}),
	() => _tmpl$$3(),
	() => [solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return !store.option.scrollMode.enabled;
		},
		get children() {
			return solid_js_web.createComponent(ZoomButton, {});
		}
	}), solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return solid_js_web.memo(() => !!store.option.scrollMode.enabled)() && store.option.scrollMode.adjustToWidth !== "full";
		},
		get children() {
			return [solid_js_web.createComponent(IconButton$1, {
				get tip() {
					return helper.t("button.zoom_in");
				},
				get enabled() {
					return store.option.scrollMode.imgScale >= 3;
				},
				onClick: () => handleScrollModeZoom("add"),
				get children() {
					return solid_js_web.createComponent(zoom_in_default, {});
				}
			}), solid_js_web.createComponent(IconButton$1, {
				get tip() {
					return helper.t("button.zoom_out");
				},
				get enabled() {
					return store.option.scrollMode.imgScale <= .1;
				},
				onClick: () => handleScrollModeZoom("sub"),
				get children() {
					return solid_js_web.createComponent(zoom_out_default, {});
				}
			})];
		}
	})],
	() => solid_js_web.createComponent(IconButton$1, {
		get tip() {
			return solid_js_web.memo(() => !!store.fullscreen)() ? helper.t("button.fullscreen_exit") : helper.t("button.fullscreen");
		},
		get hidden() {
			return !refs.root.requestFullscreen;
		},
		onClick: switchFullscreen,
		get children() {
			return solid_js_web.memo(() => !!store.fullscreen)() ? solid_js_web.createComponent(fullscreen_exit_default, {}) : solid_js_web.createComponent(fullscreen_default, {});
		}
	}),
	DownloadButton,
	() => {
		const [showPanel, setShowPanel] = solid_js.createSignal(false);
		const handleClick = () => {
			const newVal = !showPanel();
			setState("show", "toolbar", newVal);
			setShowPanel(newVal);
		};
		helper.createEffectOn(() => store.show.toolbar, (showToolbar) => showToolbar || setShowPanel(false));
		const Popper = solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return showPanel();
			},
			get children() {
				return [solid_js_web.createComponent(SettingPanel, {}), (() => {
					var _el$4 = _tmpl$2();
					_el$4.addEventListener("wheel", (e) => {
						if (isScrollMode()) refs.mangaBox.scrollBy({ top: e.deltaY });
					});
					solid_js_web.addEventListener(_el$4, "click", handleClick);
					solid_js_web.effect(() => solid_js_web.className(_el$4, classes$2.closeCover));
					return _el$4;
				})()];
			}
		});
		return solid_js_web.createComponent(IconButton$1, {
			get tip() {
				return helper.t("other.setting");
			},
			get enabled() {
				return showPanel();
			},
			get showTip() {
				return showPanel();
			},
			onClick: handleClick,
			get popperClassName() {
				return solid_js_web.memo(() => !!showPanel())() && classes$2.SettingPanelPopper;
			},
			get popper() {
				return showPanel() && Popper;
			},
			get children() {
				return solid_js_web.createComponent(settings_default, {});
			}
		});
	},
	() => _tmpl$$3(),
	() => solid_js_web.createComponent(IconButton$1, {
		get tip() {
			return helper.t("other.exit");
		},
		onClick: () => store.prop.onExit?.(),
		get children() {
			return solid_js_web.createComponent(close_default, {});
		}
	})
];
//#endregion
//#region src/components/Manga/components/Toolbar.tsx
var _tmpl$$2 = /*#__PURE__*/ solid_js_web.template(\`<div role=toolbar><div><div>\`);
/** 左侧工具栏 */
const Toolbar = () => {
	helper.createEffectOn(() => store.show.toolbar, (show) => show || focus());
	return (() => {
		var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
		solid_js_web.addEventListener(_el$2, "click", focus);
		solid_js_web.insert(_el$2, solid_js_web.createComponent(solid_js.For, {
			get each() {
				return store.prop.editButtonList(defaultButtonList);
			},
			children: (ButtonItem) => solid_js_web.createComponent(ButtonItem, {})
		}), null);
		solid_js_web.effect((_p$) => {
			var _v$ = classes$2.toolbar, _v$2 = helper.boolDataVal(store.show.toolbar), _v$3 = store.isDragMode ? "none" : void 0, _v$4 = classes$2.toolbarPanel, _v$5 = classes$2.toolbarBg;
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-show", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setStyleProperty(_el$, "pointer-events", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.className(_el$2, _p$.o = _v$4);
			_v$5 !== _p$.i && solid_js_web.className(_el$3, _p$.i = _v$5);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0
		});
		return _el$;
	})();
};
//#endregion
//#region src/components/Manga/components/WheelProgress.module.css
const classes = { "wheelProgress": "wheelProgress___bFAqF" };
//#endregion
//#region src/components/Manga/components/WheelProgress.tsx
var _tmpl$$1 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
/** 虚拟棘轮翻页进度指示线：滚动时显示，长度反映距翻页还差多少，方向与滚动方向一致 */
const WheelProgress = () => {
	css$1(\`.\${classes.wheelProgress}\`, {
		opacity: () => {
			switch (store.scrollDeviceType) {
				case void 0:
				case "a": return 0;
				default: return store.wheelProgress === 0 ? 0 : 1;
			}
		},
		"--wheel-progress": () => \`\${Math.abs(store.wheelProgress)}\`
	});
	return (() => {
		var _el$ = _tmpl$$1();
		solid_js_web.effect((_p$) => {
			var _v$ = classes.wheelProgress, _v$2 = scrollPosition(), _v$3 = store.option.dir, _v$4 = helper.boolDataVal(store.wheelProgress > 0);
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-position", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "data-dir", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-down", _p$.o = _v$4);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0
		});
		return _el$;
	})();
};
//#endregion
//#region src/components/Manga/hooks/useCssVar.ts
/** 主题颜色，通过 light-dark() 配合 color-scheme 自动选择深浅色 */
const themeStyle = {
	"--hover-bg-color": "light-dark(#0001, #FFF3)",
	"--hover-bg-color-enable": "light-dark(#0009, #FFFa)",
	"--switch": "light-dark(#FAFAFA, #BDBDBD)",
	"--switch-bg": "light-dark(#9C9C9C, #6E6E6E)",
	"--page-bg": "light-dark(white, #303030)",
	"--secondary": "#7A909A",
	"--secondary-bg": "light-dark(#BAC5CA, #556065)",
	"--text": "light-dark(black, white)",
	"--text-secondary": "light-dark(#0008, #FFFC)",
	"--text-bg": "light-dark(#FAFAFA, #121212)"
};
const createSvgIcon = (fill, d) => \`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='\${fill}' viewBox='0 0 24 24'%3E%3Cpath d='\${d}'/%3E%3C/svg%3E")\`;
const MdImageNotSupported = \`m21.9 21.9-8.49-8.49-9.82-9.82L2.1 2.1.69 3.51 3 5.83V19c0 1.1.9 2 2 2h13.17l2.31 2.31 1.42-1.41zM5 18l3.5-4.5 2.5 3.01L12.17 15l3 3H5zm16 .17L5.83 3H19c1.1 0 2 .9 2 2v13.17z\`;
const MdCloudDownload = \`M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4h3z\`;
const MdPhoto = \`M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z\`;
/** 根据当前图片滤镜选项生成 filter 值，隐藏值为 100 的滤镜 */
const getImgFilter = () => {
	const { brightness, contrast, saturate } = store.option.imgFilter;
	const list = [
		brightness !== 100 && \`brightness(\${brightness}%)\`,
		contrast !== 100 && \`contrast(\${contrast}%)\`,
		saturate !== 100 && \`saturate(\${saturate}%)\`
	].filter(Boolean);
	if (list.length > 0) return list.join(" ");
};
const useCssVar = () => {
	const svg = () => {
		const fill = store.option.darkMode ? "rgb(156,156,156)" : "rgb(110,110,110)";
		return {
			"--md-image-not-supported": createSvgIcon(fill, MdImageNotSupported),
			"--md-cloud-download": createSvgIcon(fill, MdCloudDownload),
			"--md-photo": createSvgIcon(fill, MdPhoto)
		};
	};
	const i18n = () => ({
		"--i18n-touch-area-prev": \`"\${helper.t("hotkeys.page_up")}"\`,
		"--i18n-touch-area-next": \`"\${helper.t("hotkeys.page_down")}"\`,
		"--i18n-touch-area-menu": \`"\${helper.t("touch_area.menu")}"\`
	});
	css$1(\`.\${classes$2.root}\`, [
		{
			"--bg": () => store.option.customBackground ?? (store.option.darkMode ? "#000" : "#fff"),
			"--scroll-mode-spacing": () => store.option.scrollMode.spacing,
			"color-scheme": () => store.option.darkMode ? "dark" : "light",
			"--img-filter": getImgFilter
		},
		() => themeStyle,
		svg,
		i18n
	]);
};
//#endregion
//#region src/components/Manga/hooks/useInit.ts
const useInit = (props) => {
	watchDomSize("rootSize", refs.root);
	const updateOption = (state) => {
		state.defaultOption = helper.assign(defaultOption(), props.defaultOption ?? {});
		state.option = helper.assign(state.defaultOption, props.option ?? {});
	};
	const bindProp = (key, defaultValue) => (state) => Reflect.set(state.prop, key, props[key] ?? defaultValue);
	const bindDebounce = (key) => (state) => {
		state.prop[key] = props[key] ? helper.debounce(props[key]) : void 0;
	};
	const watchProps = {
		option: updateOption,
		onLoading: bindDebounce("onLoading"),
		onOptionChange: bindDebounce("onOptionChange"),
		onHotkeysChange: bindDebounce("onHotkeysChange"),
		onShowImgsChange: bindDebounce("onShowImgsChange"),
		defaultOption(state) {
			updateOption(state);
		},
		fillEffect(state) {
			state.fillEffect = props.fillEffect ?? { "-1": true };
			updatePageData(state);
		},
		onExit(state) {
			state.prop.onExit = (isEnd) => {
				playAnimation(refs.exit);
				props.onExit?.(Boolean(isEnd));
				setState((draftState) => {
					if (isEnd) draftState.activePageIndex = 0;
					draftState.show.endPage = void 0;
				});
				if (document.fullscreenElement) document.exitFullscreen();
			};
		},
		onPrev(state) {
			state.prop.onPrev = props.onPrev ? helper.throttle(() => {
				playAnimation(refs.prev);
				props.onPrev?.();
			}, 1e3) : void 0;
		},
		onNext(state) {
			state.prop.onNext = props.onNext ? helper.throttle(() => {
				playAnimation(refs.next);
				props.onNext?.();
			}, 1e3) : void 0;
		},
		onImgError: bindProp("onImgError"),
		onWaitUrlImgs: bindProp("onWaitUrlImgs"),
		editButtonList: bindProp("editButtonList", (list) => list),
		editSettingList: bindProp("editSettingList", (list) => list),
		commentList(state) {
			state.commentList = props.commentList;
		},
		title(state) {
			state.title = props.title ?? "";
		}
	};
	for (const [key, fn] of Object.entries(watchProps)) solid_js.createEffect(solid_js.on(() => props[key], () => setState(fn)));
	solid_js.createEffect(() => {
		setState((state) => {
			state.hotkeys = {
				...structuredClone(defaultHotkeys()),
				...props.hotkeys
			};
		});
	});
	const handleImgList = () => {
		setState((state) => {
			const newImgMap = {};
			const newImgList = [];
			for (const img of solid_js_store.unwrap(props.imgList)) {
				const url = (typeof img === "object" ? img.src : img)?.replace(/^http:/u, "") ?? "";
				newImgList.push(url);
				if (Reflect.has(newImgMap, url)) continue;
				if (Reflect.has(state.imgMap, url)) {
					newImgMap[url] = state.imgMap[url];
					continue;
				}
				const imgItem = typeof img === "string" ? { src: url } : img;
				imgItem.loadType ??= "wait";
				if (imgItem.width && imgItem.height) imgItem.type = getImgType(imgItem);
				imgItem.size = getImgDisplaySize(state, imgItem);
				if (!imgItem.blobUrl && url.startsWith("blob:")) imgItem.blobUrl = imgItem.src;
				newImgMap[url] = imgItem;
			}
			/** 修改前的当前显示图片 */
			const oldActiveImg = state.pageList[state.activePageIndex]?.map((i) => state.imgList?.[i]) ?? [];
			/** 是否需要重置页面填充 */
			let needResetFillEffect = false;
			const fillEffectList = Object.keys(state.fillEffect).map(Number);
			for (const pageIndex of fillEffectList) {
				if (pageIndex === -1) continue;
				if (state.imgList[pageIndex] === newImgList[pageIndex]) continue;
				needResetFillEffect = true;
				break;
			}
			const oldImgSet = new Set(state.imgList);
			const newImgSet = new Set(newImgList);
			if (oldImgSet.size === 0 && newImgList.length > 0) {
				resumeReadProgress(state);
				if (state.option.translation.enabled) updateMitTranslators(true);
			}
			/** 被删除的图片 */
			const deleteList = oldImgSet.difference(newImgSet);
			for (const url of deleteList) if (state.imgMap[url].blobUrl && state.imgMap[url].blobUrl !== url) URL.revokeObjectURL(state.imgMap[url].blobUrl);
			/** 删除图片数 */
			const deleteNum = deleteList.size;
			/** 传入的是否是新漫画 */
			const isNew = deleteNum >= oldImgSet.size * .8;
			/** 是否需要更新页面 */
			const needUpdatePageData = needResetFillEffect || state.imgList.length !== newImgList.length || deleteNum > 0;
			state.imgMap = newImgMap;
			state.imgList = [...newImgList];
			state.prop.onLoading?.(state.imgList.map((url) => state.imgMap[url]));
			if (isNew) state.show.endPage = void 0;
			if (isNew || needResetFillEffect) state.fillEffect = props.fillEffect ?? { "-1": true };
			if (isNew || needUpdatePageData) {
				updatePageData(state);
				if (state.activePageIndex >= state.pageList.length) state.activePageIndex = state.pageList.length - 1;
				updateShowRange(state);
			}
			syncImgLoadState(state);
			if (isNew || state.pageList.length === 0) {
				resetImgState(state);
				state.activePageIndex = 0;
				scrollTo(0);
				return;
			}
			oldActiveImg.some((url) => {
				if (!url || newImgSet.has(url)) return false;
				const newPageIndex = state.pageList.findIndex((page) => page.some((index) => state.imgList?.[index] === url));
				if (newPageIndex === -1) return false;
				state.activePageIndex = newPageIndex;
				return true;
			});
			if (state.activePageIndex > state.pageList.length - 1) state.activePageIndex = state.pageList.length - 1;
		});
	};
	helper.createEffectOn(helper.createRootMemo(() => props.imgList), helper.throttle(handleImgList, 500));
	refs.root.addEventListener("fullscreenchange", () => {
		if (!document.fullscreenElement) return setState("fullscreen", false);
		if (document.fullscreenElement.id === "comicRead" || document.fullscreenElement.classList.contains(classes$2.root)) setState("fullscreen", true);
	});
	for (const eventName of [
		"keypress",
		"keyup",
		"touchstart",
		"touchmove",
		"touchend"
	]) refs.root.addEventListener(eventName, stopPropagation, { capture: true });
	focus();
};
//#endregion
//#region src/components/Manga/index.module.css?inline
var index_module_default = ".img___7ajV4 img {\\n  display: block;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  object-fit: contain;\\n  filter: var(--img-filter, none);\\n}\\n\\n.img___7ajV4 {\\n  position: relative;\\n\\n  align-content: center;\\n\\n  width: 100%;\\n  height: 100%;\\n  margin-right: auto;\\n  margin-left: auto;\\n}\\n\\n.img___7ajV4 > picture {\\n    position: absolute;\\n    inset: 0;\\n\\n    width: auto;\\n    max-width: 100%;\\n    height: auto;\\n    max-height: 100%;\\n    margin-top: auto;\\n    margin-right: inherit;\\n    margin-bottom: auto;\\n    margin-left: inherit;\\n  }\\n\\n.img___7ajV4 > picture,.img___7ajV4 > picture::after {\\n    background-color: var(--hover-bg-color, #fff3);\\n    background-image: var(--md-photo);\\n    background-repeat: no-repeat;\\n    background-position: center;\\n    background-size: 30%;\\n  }\\n\\n/* 已加载完毕的图片不显示灰色背景和图标 */\\n\\n.img___7ajV4:not([data-load-type]) > picture,.img___7ajV4:not([data-load-type]) > picture::after {\\n    background: none;\\n  }\\n\\n/* 遮住默认的出错图片标识 */\\n\\n.img___7ajV4[data-load-type='error'] > picture::after {\\n    pointer-events: none;\\n    content: '';\\n\\n    position: absolute;\\n    top: 0;\\n    right: 0;\\n\\n    width: 100%;\\n    height: 100%;\\n\\n    background-color: #eee;\\n    background-image: var(--md-image-not-supported);\\n  }\\n\\n.img___7ajV4[data-load-type='loading'] > picture {\\n    background-image: var(--md-cloud-download);\\n\\n    /* 加载中的图片先隐藏一下，避免出错图片的元素被直接显示出来 */\\n  }\\n\\n:is(.img___7ajV4[data-load-type='loading'] > picture) img {\\n      animation: show___HzwUa 100ms forwards;\\n    }\\n\\n.img___7ajV4[data-load-type='error'] > picture {\\n    cursor: pointer;\\n  }\\n\\n.mangaFlow___jMZgq[dir='ltr'] .img___7ajV4[data-show='1'],\\n.mangaFlow___jMZgq[dir='rtl'] .img___7ajV4[data-show='0'] {\\n  margin-right: auto;\\n  margin-left: 0;\\n}\\n\\n.mangaFlow___jMZgq[dir='ltr'] .img___7ajV4[data-show='0'],\\n.mangaFlow___jMZgq[dir='rtl'] .img___7ajV4[data-show='1'] {\\n  margin-right: 0;\\n  margin-left: auto;\\n}\\n\\n.mangaFlow___jMZgq {\\n  touch-action: none;\\n  will-change: left, top;\\n  -webkit-user-select: none;\\n          user-select: none;\\n\\n  position: absolute;\\n  transform-origin: 0 0;\\n\\n  contain: layout;\\n  overflow: visible;\\n  display: grid;\\n  grid-auto-columns: 100%;\\n  grid-auto-flow: column;\\n  grid-auto-rows: 100%;\\n  row-gap: 0;\\n  place-items: center;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  color: var(--text);\\n\\n  backface-visibility: hidden;\\n}\\n\\n.mangaFlow___jMZgq[data-disable-zoom] .img___7ajV4 > picture {\\n    width: fit-content;\\n    height: fit-content;\\n  }\\n\\n.mangaFlow___jMZgq[data-hidden-mouse='true'] {\\n    cursor: none;\\n  }\\n\\n.mangaFlow___jMZgq[data-vertical] {\\n    grid-auto-flow: row;\\n  }\\n\\n.mangaBox___48Jek {\\n  transform-origin: 0 0;\\n\\n  contain: layout style;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  transition-duration: 0ms;\\n}\\n\\n.mangaBox___48Jek[data-animation='page'] .mangaFlow___jMZgq,.mangaBox___48Jek[data-animation='zoom'] {\\n    transition-duration: 300ms;\\n  }\\n\\n.root___Hf5H2 .mangaBox___48Jek {\\n  /* 隐藏滚动条但不影响滚动 */\\n  scrollbar-width: none;\\n\\n  /* 隐藏滚动条但不影响滚动 */\\n}\\n\\n:is(.root___Hf5H2 .mangaBox___48Jek)::-webkit-scrollbar {\\n    display: none;\\n  }\\n\\n.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek {\\n  overflow: auto;\\n}\\n\\n:is(.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek) .mangaFlow___jMZgq {\\n    touch-action: pan-y;\\n    row-gap: calc(var(--scroll-mode-spacing) * 7px);\\n    height: fit-content;\\n  }\\n\\n[data-abreast-scroll]:is(.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek) {\\n    touch-action: none;\\n    overflow: hidden;\\n  }\\n\\n[data-abreast-scroll]:is(.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek) .mangaFlow___jMZgq {\\n      column-gap: calc(var(--scroll-mode-spacing) * 7px);\\n      align-items: start;\\n      height: 100%;\\n    }\\n\\n:is([data-abreast-scroll]:is(.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek) .mangaFlow___jMZgq) .img___7ajV4 {\\n        width: 100%;\\n        height: auto;\\n      }\\n\\n[data-show]:is(:is([data-abreast-scroll]:is(.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek) .mangaFlow___jMZgq) .img___7ajV4) {\\n          will-change: transform;\\n        }\\n\\n:is(:is([data-abreast-scroll]:is(.root___Hf5H2[data-scroll-mode] .mangaBox___48Jek) .mangaFlow___jMZgq) .img___7ajV4) > picture {\\n          position: relative;\\n        }\\n\\n.pageTip___P7thU {\\n  pointer-events: none;\\n\\n  position: absolute;\\n  z-index: 1;\\n  right: 0.4em;\\n  bottom: 0.4em;\\n\\n  padding: 0.1em 0.4em;\\n  border-radius: 0.25em;\\n\\n  font-size: 1.5em;\\n  line-height: 1.5;\\n  color: var(--text);\\n\\n  opacity: 0;\\n  background-color: color-mix(in srgb, var(--text-bg) 80%, transparent);\\n\\n  transition: opacity 150ms;\\n}\\n\\n.root___Hf5H2[data-page-tip] .pageTip___P7thU {\\n  opacity: 1;\\n}\\n\\n@keyframes show___HzwUa {\\n  0% {\\n    opacity: 0;\\n  }\\n\\n  90% {\\n    opacity: 0;\\n  }\\n\\n  100% {\\n    opacity: 1;\\n  }\\n}\\n\\n.endPage___iOZmk,\\n.endPageBody___g-dz- {\\n  z-index: 10;\\n\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n.endPage___iOZmk {\\n  pointer-events: none;\\n\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n\\n  color: white;\\n\\n  opacity: 0;\\n  background-color: #333d;\\n\\n  transition: opacity 500ms;\\n}\\n\\n.endPage___iOZmk[data-show] {\\n    pointer-events: all;\\n    opacity: 1;\\n  }\\n\\n.endPage___iOZmk[data-type='start'] .tip___fyxqg {\\n    transform: translateY(-10em);\\n  }\\n\\n.endPage___iOZmk[data-type='end'] .tip___fyxqg {\\n    transform: translateY(10em);\\n  }\\n\\n.endPage___iOZmk .endPageBody___g-dz- {\\n    transform: translate(0, var(--drag-y, 0));\\n    transition: transform 200ms;\\n  }\\n\\n:is(.endPage___iOZmk .endPageBody___g-dz-) button {\\n      cursor: pointer;\\n\\n      transform-origin: center;\\n\\n      font-size: 1.2em;\\n      color: inherit;\\n\\n      background-color: transparent;\\n\\n      animation: jello___wXBLg 0.3s forwards;\\n    }\\n\\n[data-is-end]:is(:is(.endPage___iOZmk .endPageBody___g-dz-) button) {\\n        margin: 2em;\\n        font-size: 3em;\\n      }\\n\\n:is(.endPage___iOZmk .endPageBody___g-dz-) .tip___fyxqg {\\n      position: absolute;\\n      margin: auto;\\n    }\\n\\n.endPage___iOZmk[data-drag] .endPageBody___g-dz- {\\n    transition: transform 00ms;\\n  }\\n\\n.root___Hf5H2[data-mobile] .endPage___iOZmk > button {\\n  width: 1em;\\n}\\n\\n.comments___9ITQv {\\n  position: absolute;\\n  right: 1em;\\n\\n  overflow: auto;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: flex-end;\\n\\n  width: 20em;\\n  max-height: 80%;\\n  padding-right: 0.5em;\\n\\n  opacity: 0.3;\\n}\\n\\n.comments___9ITQv > p {\\n    margin: 0.5em 0.1em;\\n    padding: 0.2em 0.5em;\\n    border-radius: 0.5em;\\n    background-color: #333b;\\n  }\\n\\n.comments___9ITQv:hover {\\n    opacity: 1;\\n  }\\n\\n.root___Hf5H2[data-mobile] .comments___9ITQv {\\n  bottom: 0;\\n  max-height: 15em;\\n  opacity: 0.8;\\n}\\n\\n@keyframes jello___wXBLg {\\n  0%,\\n  11.1%,\\n  100% {\\n    transform: translate3d(0, 0, 0);\\n  }\\n\\n  22.2% {\\n    transform: skewX(-12.5deg) skewY(-12.5deg);\\n  }\\n\\n  33.3% {\\n    transform: skewX(6.25deg) skewY(6.25deg);\\n  }\\n\\n  44.4% {\\n    transform: skewX(-3.125deg) skewY(-3.125deg);\\n  }\\n\\n  55.5% {\\n    transform: skewX(1.5625deg) skewY(1.5625deg);\\n  }\\n\\n  66.6% {\\n    transform: skewX(-0.7812deg) skewY(-0.7812deg);\\n  }\\n\\n  77.7% {\\n    transform: skewX(0.3906deg) skewY(0.3906deg);\\n  }\\n\\n  88.8% {\\n    transform: skewX(-0.1953deg) skewY(-0.1953deg);\\n  }\\n}\\n\\n.toolbar___RMjHL {\\n  position: fixed;\\n  z-index: 9;\\n  top: 0;\\n\\n  display: flex;\\n  align-items: center;\\n  justify-content: flex-start;\\n\\n  height: 100%;\\n}\\n\\n/* 工具栏面板 */\\n.toolbarPanel___XYjgc {\\n  position: relative;\\n  transform: translateX(-100%);\\n\\n  display: flex;\\n  flex-direction: column;\\n\\n  padding: 0.5em;\\n\\n  transition: transform 200ms;\\n}\\n.toolbarPanel___XYjgc > hr {\\n    height: 1em;\\n    margin: 0;\\n    border: none;\\n    visibility: hidden;\\n  }\\n\\n:is(.toolbar___RMjHL[data-show], .toolbar___RMjHL:hover) .toolbarPanel___XYjgc {\\n  transform: none;\\n}\\n\\n.toolbarBg___i4oTA {\\n  position: absolute;\\n  top: 0;\\n  right: 0;\\n\\n  width: 100%;\\n  height: 100%;\\n  border-top-right-radius: 1em;\\n  border-bottom-right-radius: 1em;\\n\\n  background-color: var(--page-bg);\\n  filter: opacity(0.8);\\n}\\n\\n/* 移动端优化 */\\n/* 调大样式 */\\n.root___Hf5H2[data-mobile] .toolbar___RMjHL {\\n    font-size: 1.3em;\\n  }\\n/* 只能通过点击中心来唤出工具栏，防止误触 */\\n.root___Hf5H2[data-mobile] .toolbar___RMjHL:not([data-show]) {\\n    pointer-events: none;\\n  }\\n/* 减少背景的透明度，方便辨识 */\\n.root___Hf5H2[data-mobile] .toolbarBg___i4oTA {\\n    filter: opacity(0.8);\\n  }\\n/* 设置面板所在的悬浮框样式 */\\n.SettingPanelPopper___uEBz3 {\\n  pointer-events: unset !important;\\n  transform: none !important;\\n  height: 0 !important;\\n  padding: 0 !important;\\n}\\n\\n.SettingPanel___ZRvFB {\\n  -webkit-user-select: text;\\n          user-select: text;\\n\\n  position: fixed;\\n  z-index: 1;\\n  top: 0;\\n  bottom: 0;\\n\\n  overflow: auto;\\n\\n  max-width: calc(100% - 5em);\\n  height: fit-content;\\n  max-height: 95%;\\n  margin: auto;\\n  border-radius: 0.3em;\\n\\n  font-size: 1.2em;\\n  color: var(--text);\\n\\n  background-color: var(--page-bg);\\n  box-shadow:\\n    rgb(0 0 0 / 20%) 0 3px 1px -2px,\\n    rgb(0 0 0 / 14%) 0 2px 2px 0,\\n    rgb(0 0 0 / 12%) 0 1px 5px 0;\\n}\\n\\n.SettingPanel___ZRvFB hr {\\n    margin: 0.5em 0;\\n    color: white;\\n  }\\n\\n.SettingPanel___ZRvFB > hr {\\n    margin: 0;\\n  }\\n\\n.SettingBlock___qxNyt {\\n  display: grid;\\n  grid-template-rows: max-content 1fr;\\n  transition: grid-template-rows 200ms ease-out;\\n}\\n\\n.SettingBlock___qxNyt .SettingBlockBody___Wirnd {\\n    z-index: 0;\\n    overflow: hidden;\\n    padding: 0 0.5em;\\n    padding-bottom: 1em;\\n  }\\n\\n:is(.SettingBlock___qxNyt .SettingBlockBody___Wirnd) > div + :is(.SettingBlock___qxNyt .SettingBlockBody___Wirnd) > div {\\n      margin-top: 1em;\\n    }\\n\\n:is(.SettingBlock___qxNyt .SettingBlockBody___Wirnd) input,:is(.SettingBlock___qxNyt .SettingBlockBody___Wirnd) textarea {\\n      width: 97%;\\n      margin-top: 0.3em;\\n    }\\n\\n.SettingBlock___qxNyt[data-show='false'] {\\n    grid-template-rows: max-content 0fr;\\n    padding-bottom: unset;\\n  }\\n\\n.SettingBlock___qxNyt[data-show='false'] .SettingBlockBody___Wirnd {\\n      padding: unset;\\n    }\\n\\n.SettingBlockSubtitle___cv0Ji {\\n  cursor: pointer;\\n\\n  position: sticky;\\n  z-index: 1;\\n  top: 0;\\n\\n  height: 3em;\\n  margin-bottom: 0.1em;\\n\\n  font-size: 0.7em;\\n  line-height: 3em;\\n  color: var(--text-secondary);\\n  text-align: center;\\n\\n  background-color: var(--page-bg);\\n}\\n\\n.SettingBlockBody___Wirnd .SettingBlockSubtitle___cv0Ji {\\n  position: unset;\\n  height: 1em;\\n  line-height: 1em;\\n}\\n\\n.SettingsItem___aJhRD {\\n  position: relative;\\n  display: flex;\\n  align-items: center;\\n  justify-content: space-between;\\n}\\n\\n:is(.SettingsItem___aJhRD,.SettingsShowItem___l-D2E) + .SettingsItem___aJhRD {\\n    margin-top: 1em;\\n  }\\n\\n.SettingsItem___aJhRD[data-disabled] {\\n    opacity: 0.5;\\n  }\\n\\n.SettingsItem___aJhRD[data-disabled] button {\\n      cursor: not-allowed;\\n    }\\n\\n.SettingsItemName___UP6zJ {\\n  max-width: calc(100% - 4em);\\n\\n  font-size: 0.9em;\\n  text-align: start;\\n  overflow-wrap: anywhere;\\n  white-space: pre-wrap;\\n}\\n\\n/* 开关式设置项 */\\n.SettingsItemSwitch___LVGr9 {\\n  cursor: pointer;\\n\\n  display: inline-flex;\\n  align-items: center;\\n\\n  width: 2.3em;\\n  height: 0.8em;\\n  margin: 0.3em;\\n  padding: 0;\\n  border: 0;\\n  border-radius: 1em;\\n\\n  background-color: var(--switch-bg);\\n}\\n\\n/* 开关里的圆形按钮 */\\n.SettingsItemSwitchRound___Ds0B8 {\\n  transform: translateX(-10%);\\n\\n  width: 1.15em;\\n  height: 1.15em;\\n  border-radius: 100%;\\n\\n  background: var(--switch);\\n  box-shadow:\\n    0 2px 1px -1px rgb(0 0 0 / 20%),\\n    0 1px 1px 0 rgb(0 0 0 / 14%),\\n    0 1px 3px 0 rgb(0 0 0 / 12%);\\n\\n  transition: transform 100ms;\\n}\\n\\n.SettingsItemSwitch___LVGr9[data-checked='true'] {\\n  background: var(--secondary-bg);\\n}\\n\\n.SettingsItemSwitch___LVGr9[data-checked='true'] .SettingsItemSwitchRound___Ds0B8 {\\n    transform: translateX(110%);\\n    background: var(--secondary);\\n  }\\n\\n/* 图标按钮式设置项 */\\n.SettingsItemIconButton___Cs7BQ {\\n  cursor: pointer;\\n\\n  position: absolute;\\n  right: 0;\\n\\n  height: 1em;\\n  border: none;\\n\\n  font-size: 1.5em;\\n  color: var(--text);\\n\\n  background-color: transparent;\\n}\\n\\n/* 选择器设置项 */\\n.SettingsItemSelect___CvFKx {\\n  cursor: pointer;\\n\\n  max-width: 6.5em;\\n  margin: 0;\\n  padding: 0.3em;\\n  border: none;\\n  border-radius: 5px;\\n\\n  font-size: 0.9em;\\n  color: var(--text);\\n\\n  background-color: var(--hover-bg-color);\\n  outline: none;\\n}\\n.SettingsItemSelect___CvFKx::picker(select) {\\n    color: var(--text);\\n    background-color: var(--page-bg);\\n  }\\n.SettingsItemSelect___CvFKx option {\\n    color: var(--text);\\n    background-color: var(--page-bg);\\n  }\\n\\n/* 关闭设置弹窗的遮罩 */\\n.closeCover___qLIp5 {\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n.SettingsShowItem___l-D2E {\\n  display: grid;\\n  transition: grid-template-rows 200ms ease-out;\\n}\\n\\n.SettingsShowItem___l-D2E > .SettingsShowItemBody___bgxxq {\\n    overflow: hidden;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n:is(.SettingsShowItem___l-D2E > .SettingsShowItemBody___bgxxq) > .SettingsItem___aJhRD {\\n      margin-top: 1em;\\n    }\\n\\n:is(.SettingsShowItem___l-D2E > .SettingsShowItemBody___bgxxq) > :is(textarea,input) {\\n      margin: 0.4em 0.2em 0;\\n      line-height: 1.2;\\n    }\\n\\n[data-only-number] {\\n  padding: 0 0.2em;\\n}\\n\\n[data-only-number] + span {\\n    margin-left: -0.1em;\\n  }\\n\\n.hotkeys___uu-Xe {\\n  position: relative;\\n  z-index: 1;\\n\\n  display: flex;\\n  flex-grow: 1;\\n  flex-wrap: wrap;\\n  align-items: center;\\n\\n  padding: 0.2em;\\n  padding-top: 2em;\\n  border-bottom: 1px solid var(--secondary-bg);\\n\\n  font-size: 0.9em;\\n  color: var(--text);\\n}\\n\\n.hotkeys___uu-Xe + .hotkeys___uu-Xe {\\n    margin-top: 0.5em;\\n  }\\n\\n.hotkeys___uu-Xe:last-child {\\n    border-bottom: none;\\n  }\\n\\n.hotkeysItem___d9IKS {\\n  cursor: pointer;\\n\\n  display: flex;\\n  align-items: center;\\n\\n  box-sizing: content-box;\\n  height: 1em;\\n  margin: 0.3em;\\n  padding: 0.2em 1.2em;\\n  border-radius: 0.3em;\\n\\n  font-family: serif;\\n\\n  outline: 1px solid;\\n  outline-color: var(--secondary-bg);\\n}\\n\\n.hotkeysItem___d9IKS > svg {\\n    display: none;\\n\\n    height: 1em;\\n    margin-left: 0.4em;\\n    border-radius: 1em;\\n\\n    color: var(--page-bg);\\n\\n    opacity: 0.5;\\n    background-color: var(--text);\\n  }\\n\\n:is(.hotkeysItem___d9IKS > svg):hover {\\n      opacity: 0.9;\\n    }\\n\\n.hotkeysItem___d9IKS:hover {\\n    padding: 0.2em 0.5em;\\n  }\\n\\n.hotkeysItem___d9IKS:hover > svg {\\n      display: unset;\\n    }\\n\\n.hotkeysItem___d9IKS:focus,.hotkeysItem___d9IKS:focus-visible {\\n    outline: var(--text) solid 2px;\\n  }\\n\\n.hotkeysHeader___jU7vr {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n\\n  display: flex;\\n  align-items: center;\\n\\n  box-sizing: border-box;\\n  width: 100%;\\n  padding: 0 0.5em;\\n}\\n\\n.hotkeysHeader___jU7vr > p {\\n    line-height: 1em;\\n    text-align: start;\\n    overflow-wrap: anywhere;\\n    white-space: pre-wrap;\\n\\n    background-color: var(--page-bg);\\n  }\\n\\n.hotkeysHeader___jU7vr > div[title] {\\n    cursor: pointer;\\n\\n    transform: scale(0);\\n\\n    display: flex;\\n\\n    background-color: var(--page-bg);\\n\\n    transition: transform 100ms;\\n  }\\n\\n:is(.hotkeysHeader___jU7vr > div[title]) > svg {\\n      width: 1.6em;\\n    }\\n\\n.hotkeys___uu-Xe:hover div[title] {\\n  transform: scale(1);\\n}\\n\\n.scrollbar___hLToV {\\n  --arrow-y: clamp(\\n    0.45em,\\n    calc(var(--slider-midpoint)),\\n    calc(var(--scroll-length) - 0.45em)\\n  );\\n\\n  touch-action: none;\\n  -webkit-user-select: none;\\n          user-select: none;\\n\\n  position: absolute;\\n  z-index: 9;\\n  top: 1%;\\n  right: 3px;\\n\\n  display: flex;\\n  flex-direction: column;\\n\\n  width: 5px;\\n  height: 98%;\\n\\n  /* 扩大触发范围 */\\n  border-left: max(6vw, 1em) solid transparent;\\n}\\n\\n.scrollbar___hLToV > div {\\n    pointer-events: none;\\n\\n    display: flex;\\n    flex-direction: column;\\n    flex-grow: 1;\\n    align-items: center;\\n    justify-content: center;\\n  }\\n\\n.scrollbarPage___qghUs {\\n  transform-origin: bottom;\\n  transform: scaleY(1);\\n\\n  flex-grow: 1;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  background-color: var(--secondary);\\n\\n  transition: transform 1s;\\n}\\n\\n.scrollbarPage___qghUs[data-type='loaded'] {\\n    transform: scaleY(0);\\n  }\\n\\n.scrollbarPage___qghUs[data-upscale] {\\n    transform: scaleY(1);\\n    background-color: #b39ddb;\\n  }\\n\\n.scrollbarPage___qghUs[data-upscale='loading'] {\\n    background-color: #d1c4e9;\\n  }\\n\\n.scrollbarPage___qghUs[data-translation-type] {\\n    transform-origin: top;\\n    transform: scaleY(1);\\n    background-color: transparent;\\n  }\\n\\n.scrollbarPage___qghUs[data-translation-type='wait'] {\\n    background-color: #81c784;\\n  }\\n\\n.scrollbarPage___qghUs[data-translation-type='show'] {\\n    background-color: #4caf50;\\n  }\\n\\n.scrollbarPage___qghUs[data-translation-type='error'] {\\n    background-color: #f005;\\n  }\\n\\n.scrollbarPage___qghUs[data-type='wait'] {\\n    opacity: 0.4;\\n  }\\n\\n.scrollbarPage___qghUs[data-type='error'] {\\n    background-color: #f005;\\n  }\\n\\n/* 滚动条滑块 */\\n.scrollbarSlider___r1fWf {\\n  position: absolute;\\n  z-index: 1;\\n  transform: translateY(var(--slider-top));\\n\\n  justify-content: center;\\n\\n  width: 100%;\\n  height: var(--slider-height);\\n  border-radius: 1em;\\n\\n  opacity: 1;\\n  background-color: #fff5;\\n\\n  transition:\\n    transform 150ms,\\n    opacity 150ms;\\n}\\n\\n/* 悬浮框 */\\n.scrollbarPoper___XK5Rk {\\n  --poper-top: clamp(\\n    0%,\\n    calc(var(--slider-midpoint) - 50%),\\n    calc(var(--scroll-length) - 100%)\\n  );\\n\\n  position: absolute;\\n  right: 2em;\\n  transform: translateY(var(--poper-top));\\n\\n  width: fit-content;\\n  min-width: 1em;\\n  min-height: 1.5em;\\n  padding: 0.2em 0.5em;\\n  border-radius: 0.3em;\\n\\n  font-size: 0.8em;\\n  line-height: 1.5em;\\n  color: white;\\n  text-align: center;\\n  white-space: pre;\\n\\n  background-color: #303030;\\n}\\n\\n/* 悬浮框箭头 */\\n.scrollbar___hLToV::before {\\n  content: '';\\n\\n  position: absolute;\\n  right: 2em;\\n  transform: translate(140%, calc(var(--arrow-y) - 50%));\\n\\n  border: 0.4em solid transparent;\\n  border-left: 0.5em solid #303030;\\n\\n  background-color: transparent;\\n}\\n\\n/*\\n * 滚动条部件的显隐\\n */\\n\\n/* 悬浮提示默认隐藏 */\\n.scrollbar___hLToV::before,\\n.scrollbarPoper___XK5Rk {\\n  opacity: 0;\\n  transition:\\n    opacity 150ms,\\n    transform 150ms;\\n}\\n\\n/* 控制滚动条悬浮提示的显示 */\\n:is(.scrollbar___hLToV:hover,.scrollbar___hLToV[data-force-show]) .scrollbarPoper___XK5Rk,:is(.scrollbar___hLToV:hover,.scrollbar___hLToV[data-force-show]) .scrollbarSlider___r1fWf,:is(.scrollbar___hLToV:hover,.scrollbar___hLToV[data-force-show])::before {\\n    opacity: 1;\\n  }\\n\\n/* 拖动滚动条时取消移动过渡动画，确保跟手 */\\n.scrollbar___hLToV[data-drag]::before,.scrollbar___hLToV[data-drag] .scrollbarPoper___XK5Rk,.scrollbar___hLToV[data-drag] .scrollbarSlider___r1fWf {\\n    transition: opacity 150ms;\\n  }\\n\\n/* 实现自动隐藏 */\\n.scrollbar___hLToV[data-auto-hidden]:not([data-force-show]) .scrollbarSlider___r1fWf {\\n    opacity: 0;\\n  }\\n.scrollbar___hLToV[data-auto-hidden]:not([data-force-show]):hover .scrollbarSlider___r1fWf {\\n    opacity: 1;\\n  }\\n\\n/*\\n * 滚动条位置\\n */\\n\\n.scrollbar___hLToV[data-position='hidden'] {\\n  display: none;\\n}\\n\\n.scrollbar___hLToV[data-position='top'] {\\n  top: 1px;\\n\\n  /* 扩大触发范围 */\\n  border-bottom: max(6vh, 1em) solid transparent;\\n}\\n\\n.scrollbar___hLToV[data-position='top']::before {\\n    top: 1.2em;\\n    right: 0;\\n    transform: translate(var(--arrow-x), -120%);\\n    border-bottom: 0.5em solid #303030;\\n  }\\n\\n.scrollbar___hLToV[data-position='top'] .scrollbarPoper___XK5Rk {\\n    top: 1.2em;\\n  }\\n\\n.scrollbar___hLToV[data-position='bottom'] {\\n  top: unset;\\n  bottom: 1px;\\n\\n  /* 扩大触发范围 */\\n  border-top: max(6vh, 1em) solid transparent;\\n}\\n\\n.scrollbar___hLToV[data-position='bottom']::before {\\n    right: 0;\\n    bottom: 1.2em;\\n    transform: translate(var(--arrow-x), 120%);\\n    border-top: 0.5em solid #303030;\\n  }\\n\\n.scrollbar___hLToV[data-position='bottom'] .scrollbarPoper___XK5Rk {\\n    bottom: 1.2em;\\n  }\\n\\n.scrollbar___hLToV[data-position='top'],\\n.scrollbar___hLToV[data-position='bottom'] {\\n  --arrow-x: calc(var(--arrow-y) * -1 + 50%);\\n\\n  right: 1%;\\n\\n  flex-direction: row-reverse;\\n\\n  width: 98%;\\n  height: 5px;\\n  border-left: none;\\n}\\n\\n:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom'])::before {\\n    border-left: 0.4em solid transparent;\\n  }\\n\\n/* stylelint-disable-next-line no-descending-specificity */\\n\\n:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarSlider___r1fWf {\\n    transform: translateX(calc(var(--slider-top) * -1));\\n    width: var(--slider-height);\\n    height: 100%;\\n  }\\n\\n:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarPoper___XK5Rk {\\n    right: unset;\\n    transform: translateX(calc(var(--poper-top) * -1));\\n    padding: 0.1em 0.3em;\\n  }\\n\\n[data-dir='ltr']:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) {\\n    --arrow-x: calc(var(--arrow-y) - 50%);\\n\\n    flex-direction: row;\\n  }\\n\\n[data-dir='ltr']:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom'])::before {\\n      right: unset;\\n      left: 0;\\n    }\\n\\n/* stylelint-disable-next-line no-descending-specificity */\\n\\n[data-dir='ltr']:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarSlider___r1fWf {\\n      transform: translateX(var(--top));\\n    }\\n\\n[data-dir='ltr']:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarPoper___XK5Rk {\\n      transform: translateX(var(--poper-top));\\n    }\\n\\n/* 将 scaleY 改成 scaleX */\\n\\n:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarPage___qghUs {\\n    transform: scaleX(1);\\n  }\\n\\n[data-type='loaded']:is(:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarPage___qghUs) {\\n      transform: scaleX(0);\\n    }\\n\\n[data-translation-type]:is(:is(.scrollbar___hLToV[data-position='top'],.scrollbar___hLToV[data-position='bottom']) .scrollbarPage___qghUs) {\\n      transform: scaleX(1);\\n    }\\n\\n/* stylelint-disable-next-line no-descending-specificity */\\n\\n.scrollbar___hLToV[data-is-abreast-mode] .scrollbarPoper___XK5Rk {\\n    writing-mode: vertical-rl;\\n    line-height: 1.5em;\\n    text-orientation: upright;\\n  }\\n\\n.scrollbar___hLToV[data-is-abreast-mode][data-dir='ltr'] .scrollbarPoper___XK5Rk {\\n    writing-mode: vertical-lr;\\n  }\\n\\n/* 卷轴模式下取消滚动条的位移动画 */\\n.root___Hf5H2[data-scroll-mode] .scrollbar___hLToV::before,\\n.root___Hf5H2[data-scroll-mode] :is(.scrollbarSlider___r1fWf, .scrollbarPoper___XK5Rk) {\\n  transition: opacity 150ms;\\n}\\n\\n/* 移动端下禁用悬浮显示 */\\n:is(.root___Hf5H2[data-mobile] .scrollbar___hLToV:hover)::before,:is(.root___Hf5H2[data-mobile] .scrollbar___hLToV:hover) .scrollbarPoper___XK5Rk {\\n      opacity: 0;\\n    }\\n.touchAreaRoot___UN-W1 {\\n  pointer-events: none;\\n  -webkit-user-select: none;\\n          user-select: none;\\n\\n  position: absolute;\\n  top: 0;\\n\\n  display: grid;\\n  grid-template-columns: 1fr min(30%, 10em) 1fr;\\n  grid-template-rows: 1fr min(20%, 10em) 1fr;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  font-size: 3em;\\n  color: white;\\n  letter-spacing: 0.5em;\\n\\n  opacity: 0;\\n\\n  transition: opacity 400ms;\\n}\\n.touchAreaRoot___UN-W1[data-show] {\\n    opacity: 1;\\n  }\\n.touchAreaRoot___UN-W1 .touchArea___F6Hkh {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    text-align: center;\\n  }\\n[data-area='prev']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh),[data-area='PREV']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh) {\\n      background-color: #95e1d3e6;\\n    }\\n[data-area='menu']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh),[data-area='MENU']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh) {\\n      background-color: #fce38ae6;\\n    }\\n[data-area='next']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh),[data-area='NEXT']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh) {\\n      background-color: #f38181e6;\\n    }\\n[data-area='PREV']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh)::after {\\n      content: var(--i18n-touch-area-prev);\\n    }\\n[data-area='MENU']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh)::after {\\n      content: var(--i18n-touch-area-menu);\\n    }\\n[data-area='NEXT']:is(.touchAreaRoot___UN-W1 .touchArea___F6Hkh)::after {\\n      content: var(--i18n-touch-area-next);\\n    }\\n.touchAreaRoot___UN-W1[data-vert='true'] {\\n    flex-direction: column !important;\\n  }\\n.touchAreaRoot___UN-W1:not([data-turn-page]) .touchArea___F6Hkh[data-area='next'],.touchAreaRoot___UN-W1:not([data-turn-page]) .touchArea___F6Hkh[data-area='NEXT'],.touchAreaRoot___UN-W1:not([data-turn-page]) .touchArea___F6Hkh[data-area='prev'],.touchAreaRoot___UN-W1:not([data-turn-page]) .touchArea___F6Hkh[data-area='PREV'] {\\n      visibility: hidden;\\n    }\\n.touchAreaRoot___UN-W1[data-shrink-menu] {\\n    grid-template-columns: 1fr 2em 1fr;\\n  }\\n.touchAreaRoot___UN-W1[data-shrink-menu] .touchArea___F6Hkh[data-area='MENU'] {\\n      letter-spacing: 0;\\n    }\\n\\n.root___Hf5H2[data-mobile] .touchAreaRoot___UN-W1 {\\n    flex-direction: column !important;\\n    letter-spacing: 0;\\n  }\\n\\n.root___Hf5H2[data-mobile] [data-area]::after {\\n    font-size: 0.8em;\\n  }\\n\\n.root___Hf5H2 {\\n  position: relative;\\n\\n  overflow: hidden;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  font-size: 1em;\\n\\n  background-color: var(--bg);\\n  outline: 0;\\n}\\n\\n.root___Hf5H2 a {\\n    color: var(--text-secondary);\\n  }\\n\\n.root___Hf5H2[data-mobile] {\\n    font-size: 0.8em;\\n  }\\n\\n.hidden___rxU-6 {\\n  display: none !important;\\n}\\n\\n.invisible___cO-hs {\\n  visibility: hidden !important;\\n}\\n\\n.beautifyScrollbar___lb6kJ {\\n  /* 火狐的滚动条样式 */\\n  scrollbar-color: var(--scrollbar-slider) transparent;\\n  scrollbar-width: thin;\\n\\n  /* chrome 的滚动条样式 */\\n}\\n\\n.beautifyScrollbar___lb6kJ::-webkit-scrollbar {\\n    width: 5px;\\n    height: 10px;\\n  }\\n\\n.beautifyScrollbar___lb6kJ::-webkit-scrollbar-track {\\n    background: transparent;\\n  }\\n\\n.beautifyScrollbar___lb6kJ::-webkit-scrollbar-thumb {\\n    background: var(--scrollbar-slider);\\n  }\\n\\np,\\nimg {\\n  margin: 0;\\n}\\n\\n:where(div, div:focus, div:focus-within, div:focus-visible, button) {\\n  border: none;\\n  outline: none;\\n}\\n\\nblockquote {\\n  margin: 0.5em 0;\\n  padding: 0;\\n  padding-left: 1em;\\n  border-left: 0.25em solid var(--text-secondary, #607d8b);\\n\\n  font-size: 0.9em;\\n  font-style: italic;\\n  line-height: 1.2em;\\n  color: var(--text-secondary);\\n  text-align: start;\\n  overflow-wrap: anywhere;\\n  white-space: pre-wrap;\\n}\\n\\nsvg {\\n  width: 1em;\\n}\\n";
//#endregion
//#region src/components/Manga/index.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
solid_js.enableScheduling();
/** 漫画组件 */
const Manga = (props) => {
	css$1(index_module_default);
	useCssVar();
	solid_js.onMount(() => useInit(props));
	solid_js.createEffect(() => props.show && focus());
	return (() => {
		var _el$ = _tmpl$();
		solid_js_web.addEventListener(_el$, "wheel", handleWheel);
		solid_js_web.addEventListener(_el$, "mousedown", handleMouseDown);
		solid_js_web.addEventListener(_el$, "click", stopPropagation);
		var _ref$ = bindRef("root");
		typeof _ref$ === "function" && solid_js_web.use(_ref$, _el$);
		_el$.addEventListener("keydown", handleKeyDown, true);
		_el$.addEventListener("keyup", handleKeyUp, true);
		solid_js_web.insert(_el$, solid_js_web.createComponent(ComicImgFlow, {}), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(TouchArea, {}), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(Scrollbar, {}), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(WheelProgress, {}), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(EndPage, {}), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(Toolbar, {}), null);
		solid_js_web.effect((_p$) => {
			var _v$ = classes$2.root, _v$2 = {
				[classes$2.hidden]: props.show === false,
				[props.class ?? ""]: Boolean(props.class),
				...props.classList
			}, _v$3 = helper.boolDataVal(store.isMobile), _v$4 = helper.boolDataVal(store.option.scrollMode.enabled), _v$5 = helper.boolDataVal(store.option.pageTip === "always" || store.option.pageTip === "auto" && (store.show.pageTip || store.isScrollbarHover));
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_p$.t = solid_js_web.classList(_el$, _v$2, _p$.t);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "data-mobile", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$, "data-scroll-mode", _p$.o = _v$4);
			_v$5 !== _p$.i && solid_js_web.setAttribute(_el$, "data-page-tip", _p$.i = _v$5);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0
		});
		return _el$;
	})();
};
//#endregion
exports.DRAG_TURN_ANIMATION_DURATION = DRAG_TURN_ANIMATION_DURATION;
exports.Manga = Manga;
exports.SettingBlockSubtitle = SettingBlockSubtitle;
exports.SettingHotkeys = SettingHotkeys;
exports.SettingsItem = SettingsItem;
exports.SettingsItemButton = SettingsItemButton;
exports.SettingsItemNumber = SettingsItemNumber;
exports.SettingsItemSwitch = SettingsItemSwitch;
exports._setAbreastScrollFill = _setAbreastScrollFill;
exports.abreastArea = abreastArea;
exports.abreastColumnWidth = abreastColumnWidth;
exports.abreastContentWidth = abreastContentWidth;
exports.abreastScrollFill = abreastScrollFill;
exports.abreastScrollWidth = abreastScrollWidth;
exports.abreastShowColumn = abreastShowColumn;
exports.activeImgIndex = activeImgIndex;
exports.activePage = activePage;
exports.allowBatchTranslation = allowBatchTranslation;
exports.autoPageNum = autoPageNum;
exports.bindOption = bindOption;
exports.bindRef = bindRef;
exports.bindScrollTop = bindScrollTop;
exports.bound = bound;
exports.cancelTurnAnimation = cancelTurnAnimation;
exports.checkImgSize = checkImgSize;
exports.constantScroll = constantScroll;
exports.contentHeight = contentHeight;
exports.cotransSettings = cotransSettings;
exports.defaultHotkeys = defaultHotkeys;
exports.defaultOption = defaultOption;
exports.detectScrollDevice = detectScrollDevice;
exports.doubleClickZoom = doubleClickZoom;
exports.findTopPage = findTopPage;
exports.finishTurnAnimation = finishTurnAnimation;
exports.focus = focus;
exports.getCropMargin = getCropMargin;
exports.getImg = getImg;
exports.getImgDisplaySize = getImgDisplaySize;
exports.getImgEle = getImgEle;
exports.getImgIndexs = getImgIndexs;
exports.getImgTip = getImgTip;
exports.getImgType = getImgType;
exports.getPageTip = getPageTip;
exports.getPageTop = getPageTop;
exports.getTurnPageDir = getTurnPageDir;
exports.handleClick = handleClick;
exports.handleComicData = handleComicData;
exports.handleEndTurnPage = handleEndTurnPage;
exports.handleHotkey = handleHotkey;
exports.handleImgError = handleImgError;
exports.handleImgLoaded = handleImgLoaded;
exports.handleKeyDown = handleKeyDown;
exports.handleKeyUp = handleKeyUp;
exports.handleMangaFlowDrag = handleMangaFlowDrag;
exports.handleMouseDown = handleMouseDown;
exports.handlePinchZoom = handlePinchZoom;
exports.handleScrollModeDrag = handleScrollModeDrag;
exports.handleScrollModeZoom = handleScrollModeZoom;
exports.handleScrollbarSlider = handleScrollbarSlider;
exports.handleWheel = handleWheel;
exports.handleZoomDrag = handleZoomDrag;
exports.hotkeysMap = hotkeysMap;
exports.imgAreaStyle = imgAreaStyle;
exports.imgIndexMap = imgIndexMap;
exports.imgList = imgList;
exports.imgPageMap = imgPageMap;
exports.initStore = initStore;
exports.isAbreastMode = isAbreastMode;
exports.isBottom = isBottom;
exports.isDoubleMode = isDoubleMode;
exports.isDrag = isDrag;
exports.isEnableBg = isEnableBg;
exports.isOnePageMode = isOnePageMode;
exports.isScrollMode = isScrollMode;
exports.isSingleMode = isSingleMode;
exports.isTop = isTop;
exports.isTranslatingAll = isTranslatingAll;
exports.isTranslatingImage = isTranslatingImage;
exports.isTranslatingToEnd = isTranslatingToEnd;
exports.isUpscale = isUpscale;
exports.isUseAutoScale = isUseAutoScale;
exports.isWideType = isWideType;
exports.jumpToImg = jumpToImg;
exports.listenHotkey = listenHotkey;
exports.loadState = loadState;
exports.mitSettings = mitSettings;
exports.nowFillIndex = nowFillIndex;
exports.openScrollLock = openScrollLock;
exports.pageHeightList = pageHeightList;
exports.pageNum = pageNum;
exports.pageTopList = pageTopList;
exports.placeholderSize = placeholderSize;
exports.preloadNum = preloadNum;
exports.refs = refs;
exports.reloadImg = reloadImg;
exports.renderImgList = renderImgList;
exports.resetImgState = resetImgState;
exports.resetPage = resetPage;
exports.resetUI = resetUI;
exports.resumeReadProgress = resumeReadProgress;
exports.saveReadProgress = saveReadProgress;
exports.saveScrollProgress = saveScrollProgress;
exports.scrollBy = scrollBy;
exports.scrollDomLength = scrollDomLength;
exports.scrollLength = scrollLength;
exports.scrollPageList = scrollPageList;
exports.scrollPercentage = scrollPercentage;
exports.scrollPosition = scrollPosition;
exports.scrollProgress = scrollProgress;
exports.scrollTo = scrollTo;
exports.scrollTop = scrollTop;
exports.scrollViewImg = scrollViewImg;
exports.setAbreastScrollFill = setAbreastScrollFill;
exports.setAdjustToWidth = setAdjustToWidth;
exports.setDefaultHotkeys = setDefaultHotkeys;
exports.setImgScale = setImgScale;
exports.setImgTranslationEnbale = setImgTranslationEnbale;
exports.setIsDrag = setIsDrag;
exports.setOption = setOption;
exports.setState = setState;
exports.showImgList = showImgList;
exports.sliderHeight = sliderHeight;
exports.sliderMidpoint = sliderMidpoint;
exports.sliderTop = sliderTop;
exports.stopAutoScroll = stopAutoScroll;
exports.store = store;
exports.switchAutoScroll = switchAutoScroll;
exports.switchDir = switchDir;
exports.switchFillEffect = switchFillEffect;
exports.switchFullscreen = switchFullscreen;
exports.switchImgRecognition = switchImgRecognition;
exports.switchOnePageMode = switchOnePageMode;
exports.switchScrollMode = switchScrollMode;
exports.syncImgLoadState = syncImgLoadState;
exports.touches = touches;
exports.translateAll = translateAll;
exports.translateCurrent = translateCurrent;
exports.translateToEnd = translateToEnd;
exports.translationAll = translationAll;
exports.translationImage = translationImage;
exports.translationImgs = translationImgs;
exports.turnPage = turnPage;
exports.turnPageAnimation = turnPageAnimation;
exports.updateImgLoadType = updateImgLoadType;
exports.updateImgSize = updateImgSize;
exports.updateImgType = updateImgType;
exports.updateMitTranslators = updateMitTranslators;
exports.updatePageData = updatePageData;
exports.updateShowRange = updateShowRange;
exports.upscaleImage = upscaleImage;
exports.watchDomSize = watchDomSize;
exports.wheelRatchet = wheelRatchet;
exports.withOptionalState = withOptionalState;
exports.zoom = zoom;
`,
	"components/IconButton": `\nlet solid_js_web = require("solid-js/web");
let helper = require("helper");
let solid_js = require("solid-js");
//#region src/components/IconButton/index.module.css
const classes = {
	"iconButtonItem": "iconButtonItem___vTPHz",
	"iconButton": "iconButton___dhWw3",
	"enabled": "enabled___eXH34",
	"disable": "disable___7C-Rj",
	"iconButtonPopper": "iconButtonPopper___dVIu-",
	"hidden": "hidden___v7N-q"
};
//#endregion
//#region src/components/IconButton/index.module.css?inline
var index_module_default = ".iconButtonItem___vTPHz {\\n  position: relative;\\n  display: flex;\\n  align-items: center;\\n}\\n\\n.iconButton___dhWw3 {\\n  cursor: pointer;\\n\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n\\n  width: 1.5em;\\n  height: 1.5em;\\n  margin: 0.1em;\\n  padding: 0;\\n  border-style: none;\\n  border-radius: 9999px;\\n\\n  font-size: 1.5em;\\n  color: var(--text, white);\\n\\n  background-color: transparent;\\n  outline: none;\\n}\\n\\n.iconButton___dhWw3:focus,.iconButton___dhWw3:hover {\\n    background-color: var(--hover-bg-color, #fff3);\\n  }\\n\\n.iconButton___dhWw3.enabled___eXH34:not(.disable___7C-Rj) {\\n    color: var(--text-bg, #121212);\\n    background-color: var(--text, white);\\n  }\\n\\n.iconButton___dhWw3.enabled___eXH34:not(.disable___7C-Rj):focus,.iconButton___dhWw3.enabled___eXH34:not(.disable___7C-Rj):hover {\\n      background-color: var(--hover-bg-color-enable, #fffa);\\n    }\\n\\n.iconButton___dhWw3.disable___7C-Rj {\\n    cursor: not-allowed;\\n    opacity: 0.5;\\n    background-color: unset;\\n  }\\n\\n.iconButton___dhWw3 > svg {\\n    width: 1em;\\n  }\\n\\n/* 默认悬浮框样式 */\\n.iconButtonPopper___dVIu- {\\n  pointer-events: none;\\n  -webkit-user-select: none;\\n          user-select: none;\\n\\n  position: absolute;\\n  top: 50%;\\n  transform: translateY(-50%);\\n\\n  display: flex;\\n  align-items: center;\\n\\n  padding: 0.4em 0.5em;\\n  border-radius: 0.3em;\\n\\n  font-size: 0.8em;\\n  color: white;\\n  white-space: nowrap;\\n\\n  opacity: 0;\\n  background-color: #303030;\\n}\\n.iconButtonPopper___dVIu-[data-placement='right'] {\\n    left: calc(100% + 1.5em);\\n  }\\n.iconButtonPopper___dVIu-[data-placement='right']::before {\\n      right: calc(100% + 0.5em);\\n      border-right-color: var(--switch-bg, #6e6e6e);\\n      border-right-width: 0.5em;\\n    }\\n.iconButtonPopper___dVIu-[data-placement='left'] {\\n    right: calc(100% + 1.5em);\\n  }\\n.iconButtonPopper___dVIu-[data-placement='left']::before {\\n      left: calc(100% + 0.5em);\\n      border-left-color: var(--switch-bg, #6e6e6e);\\n      border-left-width: 0.5em;\\n    }\\n\\n/* 工具栏按钮的悬浮框的箭头 */\\n.iconButtonPopper___dVIu-::before {\\n  pointer-events: none;\\n  content: '';\\n\\n  position: absolute;\\n\\n  border-color: transparent;\\n  border-style: solid;\\n  border-width: 0.4em;\\n\\n  background-color: transparent;\\n\\n  transition: opacity 150ms;\\n}\\n\\n/* 控制悬浮框的显示 */\\n.iconButtonItem___vTPHz:is(:hover, :focus, [data-show='true']) .iconButtonPopper___dVIu- {\\n  opacity: 1;\\n}\\n\\n.hidden___v7N-q {\\n  display: none;\\n}\\n";
//#endregion
//#region src/components/IconButton/index.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<div><button type=button tabindex=0>\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
/** 图标按钮 */
const IconButton = (_props) => {
	const props = solid_js.mergeProps({ placement: "right" }, _props);
	let buttonRef;
	const handleClick = (e) => {
		if (props.disable) return;
		props.onClick?.(e);
		buttonRef?.blur();
	};
	return (() => {
		var _el$ = _tmpl$(), _el$2 = _el$.firstChild;
		solid_js_web.use((ref) => helper.css(index_module_default, ref), _el$);
		solid_js_web.addEventListener(_el$2, "click", handleClick);
		var _ref$ = buttonRef;
		typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$2) : buttonRef = _el$2;
		solid_js_web.insert(_el$2, () => props.children);
		solid_js_web.insert(_el$, (() => {
			var _c$ = solid_js_web.memo(() => !!(props.popper || props.tip));
			return () => _c$() ? (() => {
				var _el$3 = _tmpl$2();
				solid_js_web.insert(_el$3, () => props.popper || props.tip);
				solid_js_web.effect((_p$) => {
					var _v$7 = [classes.iconButtonPopper, props.popperClassName].join(" "), _v$8 = props.placement;
					_v$7 !== _p$.e && solid_js_web.className(_el$3, _p$.e = _v$7);
					_v$8 !== _p$.t && solid_js_web.setAttribute(_el$3, "data-placement", _p$.t = _v$8);
					return _p$;
				}, {
					e: void 0,
					t: void 0
				});
				return _el$3;
			})() : null;
		})(), null);
		solid_js_web.effect((_p$) => {
			var _v$ = classes.iconButtonItem, _v$2 = props.showTip, _v$3 = props.tip, _v$4 = classes.iconButton, _v$5 = props.style, _v$6 = {
				[classes.hidden]: props.hidden,
				[classes.enabled]: props.enabled,
				[classes.disable]: props.disable
			};
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-show", _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$2, "aria-label", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.className(_el$2, _p$.o = _v$4);
			_p$.i = solid_js_web.style(_el$2, _v$5, _p$.i);
			_p$.n = solid_js_web.classList(_el$2, _v$6, _p$.n);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0
		});
		return _el$;
	})();
};
//#endregion
exports.IconButton = IconButton;
`,
	"components/Fab": `\nlet solid_js_web = require("solid-js/web");
let helper = require("helper");
let solid_js = require("solid-js");
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/menu_book.svg
var _tmpl$$1 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79M21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98z"></path><path d="M13.98 11.01c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.54-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.71-.83.66c-1.62-.19-3.39-.04-4.73.39-.08.01-.16.03-.23.03m0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.71-.83.66c-1.62-.19-3.39-.04-4.73.39a1 1 0 0 1-.23.03m0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.7-.83.66c-1.62-.19-3.39-.04-4.73.39a1 1 0 0 1-.23.03">\`);
var menu_book_default = (props = {}) => (() => {
	var _el$ = _tmpl$$1();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/components/Fab/index.module.css
const classes = {
	"fabRoot": "fabRoot___rGBDZ",
	"fab": "fab___Whb2R",
	"progress": "progress___i-R0z",
	"popper": "popper___aYw7E",
	"speedDial": "speedDial___bnVgX",
	"speedDialItem": "speedDialItem___KdwiZ",
	"backdrop": "backdrop___4Sdu1"
};
//#endregion
//#region src/components/Fab/index.module.css?inline
var index_module_default = ".fabRoot___rGBDZ {\\n  touch-action: none;\\n  font-size: 1.1em;\\n  transition: transform 200ms;\\n}\\n\\n.fabRoot___rGBDZ[data-show='false'] {\\n    pointer-events: none;\\n  }\\n\\n.fabRoot___rGBDZ[data-show='false'] > button {\\n      transform: scale(0);\\n    }\\n\\n.fabRoot___rGBDZ[data-trans='true'] {\\n    opacity: 0.8;\\n  }\\n\\n.fabRoot___rGBDZ[data-trans='true']:hover,.fabRoot___rGBDZ[data-trans='true']:focus,.fabRoot___rGBDZ[data-trans='true']:focus-visible {\\n      opacity: 1;\\n    }\\n\\n.fab___Whb2R {\\n  cursor: pointer;\\n\\n  transform: scale(1);\\n\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n\\n  width: 3.6em;\\n  height: 3.6em;\\n  border: none;\\n  border-radius: 100%;\\n\\n  font-size: 1em;\\n  color: white;\\n\\n  background-color: var(--fab, #607d8b);\\n  box-shadow:\\n    0 3px 5px -1px rgb(0 0 0 / 20%),\\n    0 6px 10px 0 rgb(0 0 0 / 14%),\\n    0 1px 18px 0 rgb(0 0 0 / 12%);\\n\\n  transition: transform 200ms;\\n}\\n\\n.fab___Whb2R > svg {\\n    width: 1em;\\n    font-size: 1.5em;\\n  }\\n\\n.fab___Whb2R:focus,.fab___Whb2R:focus-visible {\\n    outline: none;\\n    box-shadow:\\n      0 3px 5px -1px rgb(0 0 0 / 50%),\\n      0 6px 10px 0 rgb(0 0 0 / 34%),\\n      0 1px 18px 0 rgb(0 0 0 / 32%);\\n  }\\n\\n/* 环形进度条 */\\n.progress___i-R0z {\\n  position: absolute;\\n  transform: rotate(-90deg);\\n\\n  display: inline-block;\\n\\n  width: 100%;\\n  height: 100%;\\n\\n  color: #b0bec5;\\n\\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\\n}\\n.progress___i-R0z > svg {\\n    stroke: currentcolor;\\n    stroke-dasharray: 290%;\\n    stroke-dashoffset: 100%;\\n    stroke-linecap: round;\\n\\n    transition: stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\\n  }\\n.progress___i-R0z:hover {\\n    color: #cfd8dc;\\n  }\\n/* 在进度条满后自动隐藏 */\\n.progress___i-R0z[aria-valuenow='1'] {\\n    opacity: 0;\\n    transition: opacity 200ms 150ms;\\n  }\\n\\n/* 默认悬浮框样式 */\\n.popper___aYw7E {\\n  pointer-events: none;\\n\\n  position: absolute;\\n  top: 50%;\\n  right: calc(100% + 1.5em);\\n  transform-origin: right;\\n  transform: translateY(-50%) scale(0);\\n\\n  display: flex;\\n  align-items: center;\\n\\n  padding: 0.4em 0.5em;\\n  border-radius: 0.3em;\\n\\n  font-size: 0.8em;\\n  color: white;\\n  white-space: nowrap;\\n\\n  opacity: 0;\\n  background-color: #303030;\\n\\n  transition:\\n    transform 230ms,\\n    opacity 150ms;\\n  transition-delay: var(--hide-delay);\\n}\\n\\n.fabRoot___rGBDZ[data-placement='right'] .popper___aYw7E {\\n  right: unset;\\n  left: calc(100% + 1.5em);\\n  transform-origin: left;\\n}\\n\\n.fabRoot___rGBDZ:is(:hover, [data-focus='true']) .popper___aYw7E {\\n  transform: translateY(-50%) scale(1);\\n  opacity: 1;\\n  transition-delay: 0ms;\\n}\\n\\n/* 快捷拨号 */\\n.speedDial___bnVgX {\\n  pointer-events: none;\\n  touch-action: none;\\n\\n  position: absolute;\\n  z-index: -1;\\n  bottom: 0;\\n\\n  display: flex;\\n  flex-direction: column-reverse;\\n  align-items: center;\\n\\n  width: 100%;\\n  padding-bottom: 120%;\\n\\n  font-size: 1.1em;\\n}\\n.speedDial___bnVgX[data-placement='bottom'] {\\n    top: 0;\\n    bottom: unset;\\n\\n    flex-direction: column;\\n\\n    padding-top: 120%;\\n    padding-bottom: unset;\\n  }\\n\\n.speedDialItem___KdwiZ {\\n  transform: scale(0);\\n\\n  margin: 0.1em 0;\\n\\n  opacity: 0;\\n\\n  transition-delay: var(--hide-delay);\\n  transition-duration: 230ms;\\n  transition-property: transform, opacity;\\n}\\n\\n/* 移到快捷拨号上时保持显示 */\\n.speedDial___bnVgX:hover {\\n  pointer-events: all;\\n}\\n\\n.fabRoot___rGBDZ:is(:hover:not([data-show='false']), [data-focus='true']) .speedDial___bnVgX {\\n  pointer-events: all;\\n}\\n\\n:is(.fabRoot___rGBDZ:is(:hover:not([data-show='false']),[data-focus='true']) .speedDial___bnVgX) > .speedDialItem___KdwiZ {\\n    transform: unset;\\n    opacity: unset;\\n    transition-delay: var(--show-delay);\\n  }\\n\\n/* 背景蒙版 */\\n.backdrop___4Sdu1 {\\n  pointer-events: none;\\n\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n\\n  width: 100vw;\\n  height: 100vh;\\n\\n  opacity: 0;\\n  background: black;\\n\\n  transition: opacity 500ms;\\n}\\n\\n.fabRoot___rGBDZ[data-focus='true'] .backdrop___4Sdu1 {\\n  pointer-events: unset;\\n}\\n\\n:is(\\n    .fabRoot___rGBDZ:hover:not([data-show='false']),\\n    .fabRoot___rGBDZ[data-focus='true'],\\n    .speedDial___bnVgX:hover\\n  )\\n  .backdrop___4Sdu1 {\\n  opacity: 0.4;\\n}\\n";
//#endregion
//#region src/components/Fab/index.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<div><div>\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<div><button type=button tabindex=-1><span role=progressbar><svg viewBox="22 22 44 44"><circle cx=44 cy=44 r=20.2 fill=none stroke-width=3.6>\`);
var _tmpl$3 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
/**
* Fab 按钮
*/
const Fab = (_props) => {
	const props = solid_js.mergeProps({
		progress: 0,
		initialShow: true,
		autoTrans: false
	}, _props);
	let lastY = window.scrollY;
	const [show, setShow] = solid_js.createSignal(props.initialShow);
	const handleScroll = helper.throttle((e) => {
		if (!e.isTrusted) return;
		if (window.scrollY === lastY) return;
		setShow(window.scrollY + window.innerHeight >= document.body.scrollHeight || window.scrollY - lastY < 0);
		lastY = window.scrollY;
	}, 200);
	solid_js.onMount(() => window.addEventListener("scroll", handleScroll));
	solid_js.onCleanup(() => window.removeEventListener("scroll", handleScroll));
	solid_js.createEffect(() => props.show && setShow(props.show));
	return (() => {
		var _el$ = _tmpl$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild;
		solid_js_web.use((ref) => helper.css(index_module_default, ref), _el$);
		solid_js_web.addEventListener(_el$2, "click", () => props.onClick?.());
		solid_js_web.use((ref) => props.ref?.(ref), _el$2);
		solid_js_web.insert(_el$2, () => props.children ?? solid_js_web.createComponent(menu_book_default, {}), _el$3);
		solid_js_web.insert(_el$2, (() => {
			var _c$ = solid_js_web.memo(() => !!props.tip);
			return () => _c$() ? (() => {
				var _el$7 = _tmpl$3();
				solid_js_web.insert(_el$7, () => props.tip);
				solid_js_web.effect(() => solid_js_web.className(_el$7, classes.popper));
				return _el$7;
			})() : null;
		})(), null);
		solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return props.speedDial?.length;
			},
			get children() {
				var _el$5 = _tmpl$(), _el$6 = _el$5.firstChild;
				solid_js_web.addEventListener(_el$6, "click", () => props.onBackdropClick?.());
				solid_js_web.insert(_el$5, solid_js_web.createComponent(solid_js.For, {
					get each() {
						return props.speedDial;
					},
					children: (SpeedDialItem, i) => (() => {
						var _el$8 = _tmpl$3();
						solid_js_web.insert(_el$8, solid_js_web.createComponent(SpeedDialItem, {}));
						solid_js_web.effect((_p$) => {
							var _v$12 = classes.speedDialItem, _v$13 = \`\${(i() + 1) * 30}ms\`, _v$14 = \`\${(props.speedDial.length - 1 - i()) * 50}ms\`, _v$15 = i() * 30;
							_v$12 !== _p$.e && solid_js_web.className(_el$8, _p$.e = _v$12);
							_v$13 !== _p$.t && solid_js_web.setStyleProperty(_el$8, "--show-delay", _p$.t = _v$13);
							_v$14 !== _p$.a && solid_js_web.setStyleProperty(_el$8, "--hide-delay", _p$.a = _v$14);
							_v$15 !== _p$.o && solid_js_web.setAttribute(_el$8, "data-i", _p$.o = _v$15);
							return _p$;
						}, {
							e: void 0,
							t: void 0,
							a: void 0,
							o: void 0
						});
						return _el$8;
					})()
				}), null);
				solid_js_web.effect((_p$) => {
					var _v$ = classes.speedDial, _v$2 = props.speedDialPlacement, _v$3 = classes.backdrop;
					_v$ !== _p$.e && solid_js_web.className(_el$5, _p$.e = _v$);
					_v$2 !== _p$.t && solid_js_web.setAttribute(_el$5, "data-placement", _p$.t = _v$2);
					_v$3 !== _p$.a && solid_js_web.className(_el$6, _p$.a = _v$3);
					return _p$;
				}, {
					e: void 0,
					t: void 0,
					a: void 0
				});
				return _el$5;
			}
		}), null);
		solid_js_web.effect((_p$) => {
			var _v$4 = classes.fabRoot, _v$5 = props.show ?? show(), _v$6 = props.autoTrans, _v$7 = props.focus, _v$8 = props.placement, _v$9 = {
				...props.style,
				"--hide-delay": \`\${(props.speedDial?.length ?? 0) * 50}ms\`
			}, _v$0 = classes.fab, _v$1 = classes.progress, _v$10 = props.progress, _v$11 = \`\${(1 - props.progress) * 290}%\`;
			_v$4 !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$4);
			_v$5 !== _p$.t && solid_js_web.setAttribute(_el$, "data-show", _p$.t = _v$5);
			_v$6 !== _p$.a && solid_js_web.setAttribute(_el$, "data-trans", _p$.a = _v$6);
			_v$7 !== _p$.o && solid_js_web.setAttribute(_el$, "data-focus", _p$.o = _v$7);
			_v$8 !== _p$.i && solid_js_web.setAttribute(_el$, "data-placement", _p$.i = _v$8);
			_p$.n = solid_js_web.style(_el$, _v$9, _p$.n);
			_v$0 !== _p$.s && solid_js_web.className(_el$2, _p$.s = _v$0);
			_v$1 !== _p$.h && solid_js_web.className(_el$3, _p$.h = _v$1);
			_v$10 !== _p$.r && solid_js_web.setAttribute(_el$3, "aria-valuenow", _p$.r = _v$10);
			_v$11 !== _p$.d && solid_js_web.setStyleProperty(_el$4, "stroke-dashoffset", _p$.d = _v$11);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0,
			s: void 0,
			h: void 0,
			r: void 0,
			d: void 0
		});
		return _el$;
	})();
};
//#endregion
exports.Fab = Fab;
`,
	"components/Toast": `\nlet helper = require("helper");
let solid_js_web = require("solid-js/web");
let solid_js = require("solid-js");
//#region src/components/Toast/store.tsx
const { store, setState } = helper.useStore({
	ref: null,
	list: [],
	map: {}
});
const creatId = () => {
	let id = \`\${Date.now()}\`;
	while (Reflect.has(store.map, id)) id += "_";
	return id;
};
const dismiss = (id) => Reflect.has(store.map, id) && setState("map", id, "exit", true);
//#endregion
//#region src/components/Toast/index.module.css
const classes = {
	"root": "root___AXj2H",
	"item": "item___eASYv",
	"bounceInRight": "bounceInRight___94v9w",
	"bounceOutRight": "bounceOutRight___0RcOn",
	"schedule": "schedule___AWwkh",
	"msg": "msg___pGOp2"
};
//#endregion
//#region src/components/Toast/index.module.css?inline
var index_module_default = ".root___AXj2H {\\n  pointer-events: none;\\n\\n  position: fixed;\\n  z-index: 2147483647;\\n  right: 0;\\n  bottom: 0;\\n\\n  display: flex;\\n  flex-direction: column;\\n  align-items: flex-end;\\n\\n  font-size: 16px;\\n}\\n\\n.item___eASYv {\\n  pointer-events: auto;\\n  cursor: pointer;\\n\\n  position: relative;\\n\\n  overflow: hidden;\\n  display: flex;\\n  align-items: center;\\n\\n  width: fit-content;\\n  max-width: min(30em, 100vw);\\n  margin: 1em;\\n  padding: 0.8em 1em;\\n  border-radius: 4px;\\n\\n  color: #000;\\n\\n  background: #fff;\\n  box-shadow:\\n    0 1px 10px 0 #0000001a,\\n    0 2px 15px 0 #0000000d;\\n\\n  animation: bounceInRight___94v9w 0.5s 1;\\n}\\n\\n.item___eASYv > svg {\\n    width: 1.5em;\\n    margin-right: 0.5em;\\n    color: var(--theme);\\n  }\\n\\n.item___eASYv[data-exit] {\\n    animation: bounceOutRight___0RcOn 0.5s 1;\\n  }\\n\\n.schedule___AWwkh {\\n  position: absolute;\\n  bottom: 0;\\n  left: 0;\\n  transform-origin: left;\\n\\n  width: 100%;\\n  height: 0.2em;\\n\\n  background-color: var(--theme);\\n}\\n\\n.item___eASYv[data-schedule] .schedule___AWwkh {\\n  transition: transform 100ms;\\n}\\n\\n.item___eASYv:not([data-schedule]) .schedule___AWwkh {\\n  animation: schedule___AWwkh linear 1 forwards;\\n}\\n\\n:is(.item___eASYv:hover, .item___eASYv[data-schedule], .root___AXj2H[data-paused]) .schedule___AWwkh {\\n  animation-play-state: paused;\\n}\\n\\n.msg___pGOp2 {\\n  width: fit-content;\\n\\n  line-height: 1.4em;\\n  text-align: start;\\n  overflow-wrap: anywhere;\\n  white-space: break-spaces;\\n}\\n\\n.msg___pGOp2 h2 {\\n    margin: 0;\\n  }\\n\\n.msg___pGOp2 h3 {\\n    margin: 0.7em 0;\\n  }\\n\\n.msg___pGOp2 ul {\\n    margin: 0;\\n    text-align: left;\\n  }\\n\\n.msg___pGOp2 button {\\n    cursor: pointer;\\n\\n    margin: 0 0.5em;\\n    padding: 0.2em 0.6em;\\n    border: none;\\n    border-radius: 0.4em;\\n\\n    font-size: inherit;\\n\\n    background-color: #eee;\\n    outline: none;\\n  }\\n\\n:is(.msg___pGOp2 button):hover {\\n      background: #e0e0e0;\\n    }\\n\\np {\\n  margin: 0;\\n}\\n\\n@keyframes schedule___AWwkh {\\n  0% {\\n    transform: scaleX(1);\\n  }\\n\\n  100% {\\n    transform: scaleX(0);\\n  }\\n}\\n\\n@keyframes bounceInRight___94v9w {\\n  0%,\\n  60%,\\n  75%,\\n  90%,\\n  100% {\\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\\n  }\\n\\n  0% {\\n    transform: translate3d(3000px, 0, 0) scaleX(3);\\n    opacity: 0;\\n  }\\n\\n  60% {\\n    transform: translate3d(-25px, 0, 0) scaleX(1);\\n    opacity: 1;\\n  }\\n\\n  75% {\\n    transform: translate3d(10px, 0, 0) scaleX(0.98);\\n  }\\n\\n  90% {\\n    transform: translate3d(-5px, 0, 0) scaleX(0.995);\\n  }\\n\\n  100% {\\n    transform: translate3d(0, 0, 0);\\n  }\\n}\\n\\n@keyframes bounceOutRight___0RcOn {\\n  20% {\\n    transform: translate3d(-20px, 0, 0) scaleX(0.9);\\n    opacity: 1;\\n  }\\n\\n  100% {\\n    transform: translate3d(2000px, 0, 0) scaleX(2);\\n    opacity: 0;\\n  }\\n}\\n";
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/check_circle.svg
var _tmpl$$5 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2M9.29 16.29 5.7 12.7a.996.996 0 1 1 1.41-1.41L10 14.17l6.88-6.88a.996.996 0 1 1 1.41 1.41l-7.59 7.59a.996.996 0 0 1-1.41 0">\`);
var check_circle_default = (props = {}) => (() => {
	var _el$ = _tmpl$$5();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/error.svg
var _tmpl$$4 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1 4h-2v-2h2z">\`);
var error_default = (props = {}) => (() => {
	var _el$ = _tmpl$$4();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/info.svg
var _tmpl$$3 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1-8h-2V7h2z">\`);
var info_default = (props = {}) => (() => {
	var _el$ = _tmpl$$3();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/warning.svg
var _tmpl$$2 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3M12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1m1 4h-2v-2h2z">\`);
var warning_default = (props = {}) => (() => {
	var _el$ = _tmpl$$2();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/components/Toast/ToastItem.tsx
var _tmpl$$1 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<div><div>\`);
const iconMap = {
	info: info_default,
	success: check_circle_default,
	warn: warning_default,
	error: error_default
};
const colorMap = {
	info: "#3a97d7",
	success: "#23bb35",
	warn: "#f0c53e",
	error: "#e45042",
	custom: "#1f2936"
};
/** 删除 toast */
const dismissToast = (id) => setState((state) => {
	state.map[id]?.onDismiss?.({ ...state.map[id] });
	const i = state.list.indexOf(id);
	if (i !== -1) state.list.splice(i, 1);
	Reflect.deleteProperty(state.map, id);
});
/** 重置 toast 的 update 属性 */
const resetToastUpdate = (id) => setState("map", id, "update", void 0);
const ToastItem = (props) => {
	/** 是否要显示进度 */
	const showSchedule = solid_js.createMemo(() => props.duration === Infinity && props.schedule ? true : void 0);
	const triggerDismiss = (e) => {
		e.stopPropagation();
		if (showSchedule() && "animationName" in e) return;
		dismiss(props.id);
	};
	const handleAnimationEnd = () => {
		if (!props.exit) return;
		dismissToast(props.id);
	};
	let scheduleRef;
	solid_js.createEffect(() => {
		if (!props.update) return;
		resetToastUpdate(props.id);
		if (!scheduleRef) return;
		for (const animation of scheduleRef.getAnimations()) animation.currentTime = 0;
	});
	const handleClick = (e) => {
		props.onClick?.();
		triggerDismiss(e);
	};
	return (() => {
		var _el$ = _tmpl$2(), _el$2 = _el$.firstChild;
		_el$.addEventListener("animationend", handleAnimationEnd);
		solid_js_web.addEventListener(_el$, "click", handleClick);
		solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js_web.Dynamic, { get component() {
			return iconMap[props.type];
		} }), _el$2);
		solid_js_web.insert(_el$2, (() => {
			var _c$ = solid_js_web.memo(() => typeof props.msg === "string");
			return () => _c$() ? props.msg : solid_js_web.createComponent(props.msg, {});
		})());
		solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return props.duration !== Infinity || props.schedule !== void 0;
			},
			get children() {
				var _el$3 = _tmpl$$1();
				_el$3.addEventListener("animationend", triggerDismiss);
				var _ref$ = scheduleRef;
				typeof _ref$ === "function" ? solid_js_web.use(_ref$, _el$3) : scheduleRef = _el$3;
				solid_js_web.effect((_p$) => {
					var _v$ = classes.schedule, _v$2 = \`\${props.duration}ms\`, _v$3 = showSchedule() ? \`scaleX(\${props.schedule})\` : void 0;
					_v$ !== _p$.e && solid_js_web.className(_el$3, _p$.e = _v$);
					_v$2 !== _p$.t && solid_js_web.setStyleProperty(_el$3, "animation-duration", _p$.t = _v$2);
					_v$3 !== _p$.a && solid_js_web.setStyleProperty(_el$3, "transform", _p$.a = _v$3);
					return _p$;
				}, {
					e: void 0,
					t: void 0,
					a: void 0
				});
				return _el$3;
			}
		}), null);
		solid_js_web.effect((_p$) => {
			var _v$4 = classes.item, _v$5 = colorMap[props.type], _v$6 = showSchedule(), _v$7 = props.exit, _v$8 = classes.msg;
			_v$4 !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$4);
			_v$5 !== _p$.t && solid_js_web.setStyleProperty(_el$, "--theme", _p$.t = _v$5);
			_v$6 !== _p$.a && solid_js_web.setAttribute(_el$, "data-schedule", _p$.a = _v$6);
			_v$7 !== _p$.o && solid_js_web.setAttribute(_el$, "data-exit", _p$.o = _v$7);
			_v$8 !== _p$.i && solid_js_web.className(_el$2, _p$.i = _v$8);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0
		});
		return _el$;
	})();
};
//#endregion
//#region src/components/Toast/Toaster.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
const Toaster = () => {
	const [visible, setVisible] = solid_js.createSignal(document.visibilityState === "visible");
	solid_js.onMount(() => {
		helper.css(index_module_default, store.ref);
		const handleVisibilityChange = () => {
			setVisible(document.visibilityState === "visible");
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		solid_js.onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
	});
	return (() => {
		var _el$ = _tmpl$();
		solid_js_web.use((ref) => setState("ref", ref), _el$);
		solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js.For, {
			get each() {
				return store.list;
			},
			children: (id) => solid_js_web.createComponent(ToastItem, solid_js_web.mergeProps(() => store.map[id]))
		}));
		solid_js_web.effect((_p$) => {
			var _v$ = classes.root, _v$2 = visible() ? void 0 : "";
			_v$ !== _p$.e && solid_js_web.className(_el$, _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.setAttribute(_el$, "data-paused", _p$.t = _v$2);
			return _p$;
		}, {
			e: void 0,
			t: void 0
		});
		return _el$;
	})();
};
let dom;
const init = () => {
	if (dom || store.ref) return;
	dom = helper.mountComponents("toast", () => solid_js_web.createComponent(Toaster, {}));
	dom.style.setProperty("z-index", "2147483647", "important");
};
//#endregion
//#region src/components/Toast/toast.tsx
const toast = (msg, options) => {
	if (!msg) return;
	init();
	const id = options?.id ?? (typeof msg === "string" ? msg : creatId());
	setState((state) => {
		if (Reflect.has(state.map, id)) {
			Object.assign(state.map[id], {
				msg,
				...options,
				update: true
			});
			return;
		}
		state.map[id] = {
			id,
			type: "info",
			duration: 3e3,
			msg,
			...options
		};
		state.list.push(id);
	});
	/** 弹窗后记录一下 */
	let fn = helper.log;
	switch (options?.type) {
		case "warn":
			fn = helper.log.warn;
			break;
		case "error": fn = helper.log.error;
	}
	fn("Toast:", msg);
	if (options?.throw && typeof msg === "string") throw new Error(msg);
};
toast.dismiss = dismiss;
toast.set = (id, options) => {
	if (!Reflect.has(store.map, id)) return;
	setState((state) => Object.assign(state.map[id], options));
};
toast.success = (msg, options) => toast(msg, {
	...options,
	exit: void 0,
	type: "success"
});
toast.warn = (msg, options) => toast(msg, {
	...options,
	exit: void 0,
	type: "warn"
});
toast.error = (msg, options) => toast(msg, {
	...options,
	exit: void 0,
	type: "error"
});
//#endregion
exports.Toaster = Toaster;
exports.toast = toast;
`,
	"userscript/copyApi": `\nlet core = require("core");
let helper = require("helper");
let request = require("request");
//#region src/userscript/copyApi.ts
let contentKey;
let decryptKey;
const getKeys = async (url) => {
	if (contentKey !== void 0 && decryptKey !== void 0) return [contentKey, decryptKey];
	if (helper.querySelector(".disData[contentkey]")) {
		contentKey = helper.querySelector(".disData[contentkey]").getAttribute("contentkey");
		decryptKey = helper.querySelector(".disPass[contentkey]").getAttribute("contentkey");
		return [contentKey, decryptKey];
	}
	if (unsafeWindow.contentKey !== void 0 && unsafeWindow.cct !== void 0) {
		contentKey = unsafeWindow.contentKey;
		decryptKey = unsafeWindow.cct;
		return [contentKey, decryptKey];
	}
	if (url) {
		const html = await request.request(url, {
			fetch: false,
			headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36" }
		});
		const match = /(?:var\\s+contentKey\\s*=\\s*['"](?<contentKey>[^'"]*)['"])|(?:var\\s+(?!contentKey\\b)[a-zA-Z_][a-zA-Z0-9_]*\\s*=\\s*['"](?<decryptKey>[^'"]*)['"])/gsu.exec(html.responseText)?.groups;
		if (!match) {
			core.toast.error(helper.t("site.changed_load_failed"));
			throw new Error(helper.t("site.changed_load_failed"));
		}
		({contentKey, decryptKey} = match);
		return [contentKey, decryptKey];
	}
	core.toast.error(helper.t("site.changed_load_failed"));
	throw new Error(helper.t("site.changed_load_failed"));
};
const decryptData = async (raw, key) => {
	key ||= (await getKeys())[1];
	const cipher = raw.slice(16);
	const iv = raw.slice(0, 16);
	const decryptedBuffer = await crypto.subtle.decrypt({
		name: "AES-CBC",
		iv: new TextEncoder().encode(iv)
	}, await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "AES-CBC" }, false, ["decrypt"]), new Uint8Array(cipher.match(/.{1,2}/gu).map((byte) => Number.parseInt(byte, 16))).buffer);
	return JSON.parse(new TextDecoder().decode(decryptedBuffer));
};
/** 通过解析网页变量获取图片列表 */
const getImglistByHtml = async (pageUrl) => {
	const keys = await getKeys(pageUrl);
	return (await decryptData(...keys)).map(({ url }) => url.replace(/(?<=[/.])c800x/u, "c1500x"));
};
//#endregion
exports.decryptData = decryptData;
exports.getImglistByHtml = getImglistByHtml;
`,
	"userscript/detectAd": `\n//#region \\0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let comlink = require("comlink");
comlink = __toESM(comlink, 1);
let helper = require("helper");
let request = require("request");
let worker_detectAd = require("worker/detectAd");
worker_detectAd = __toESM(worker_detectAd, 1);
//#region src/userscript/detectAd.ts
/** 用常识逻辑进行判断，以期能在检测失误时减小影响范围和遗漏 */
const getAdPage = async (list, isAdPage, adList) => {
	let i = list.length - 1;
	let normalNum = 0;
	for (; i >= list.length - 10; i--) {
		if (i <= 2) break;
		if (adList.has(i)) continue;
		const item = list[i];
		if (!item) break;
		if (await isAdPage(item)) adList.add(i);
		else if (normalNum >= 2) break;
		else normalNum += 1;
	}
	let adNum = 0;
	for (i = Math.min(...adList); i < list.length; i++) {
		if (adList.has(i)) {
			adNum += 1;
			continue;
		}
		if (adNum >= 2) adList.add(i);
		else if (adList.has(i - 1) && adList.has(i + 1)) adList.add(i);
		else adNum = 0;
	}
	return adList;
};
const imgToCanvas = async (img) => {
	if (typeof img !== "string") {
		await helper.waitImgLoad(img);
		try {
			const canvas = new OffscreenCanvas(img.width, img.height);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			if (ctx.getImageData(0, 0, 1, 1)) {
				const imgBitmap = canvas.transferToImageBitmap();
				return comlink.default.transfer(imgBitmap, [imgBitmap]);
			}
		} catch {}
	}
	const url = typeof img === "string" ? img : img.src;
	const blob = await request.downloadImg(url);
	const imgBitmap = await createImageBitmap(blob);
	return comlink.default.transfer(imgBitmap, [imgBitmap]);
};
/** 通过文件名判断是否是广告 */
const getAdPageByFileName = (fileNameList, adList) => getAdPage(fileNameList, (fileName) => /^z+/iu.test(fileName), adList);
const isAdImg = (imgBitmap) => {
	initWorker();
	return worker_detectAd.default.isAdImg(comlink.default.transfer(imgBitmap, [imgBitmap]));
};
/** 通过图片内容判断是否是广告 */
const getAdPageByContent = (imgList, adList) => getAdPage(imgList, async (img) => isAdImg(img instanceof ImageBitmap ? img : await imgToCanvas(img)), adList);
const initWorker = helper.once(() => {
	const mainFn = { log: helper.log };
	worker_detectAd.default.setMainFn(comlink.default.proxy(mainFn), Object.keys(mainFn));
});
//#endregion
exports.getAdPageByContent = getAdPageByContent;
exports.getAdPageByFileName = getAdPageByFileName;
exports.isAdImg = isAdImg;
`,
	"core": `\nlet helper = require("helper");
let userscript_autoImageScanner = require("userscript/autoImageScanner");
let solid_js_web = require("solid-js/web");
let components_Manga = require("components/Manga");
let components_Toast = require("components/Toast");
let solid_js = require("solid-js");
let components_Fab = require("components/Fab");
let components_IconButton = require("components/IconButton");
let request = require("request");
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/settings.svg
var _tmpl$$16 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5">\`);
var settings_default = (props = {}) => (() => {
	var _el$ = _tmpl$$16();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/userscript/core/escManager.ts
let priorityMap = /* @__PURE__ */ new Map();
const getPriority = (id) => {
	const p = priorityMap.get(id);
	if (p !== void 0) return p;
	helper.log.warn(\`[escManager] 未定义 「\${id}」 的优先级\`);
	return 64;
};
/** 设置字符串 ID 的对应优先级顺序 */
const setEscPriority = (ids) => {
	priorityMap = new Map(ids.map((id, index) => [id, index]));
};
const handlers = [];
const registerEsc = (id, handler) => {
	const entry = {
		priority: typeof id === "number" ? id : getPriority(id),
		handler
	};
	handlers.push(entry);
	handlers.sort((a, b) => a.priority - b.priority);
	return () => {
		const idx = handlers.indexOf(entry);
		if (idx !== -1) handlers.splice(idx, 1);
	};
};
/** 执行按优先级顺序执行所有已注册的 ESC 处理函数，返回是否有被处理 */
const handleEsc = () => {
	for (const { handler } of handlers) if (handler() !== "SKIP") return true;
	return false;
};
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/checklist.svg
var _tmpl$$15 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M22 8c0-.55-.45-1-1-1h-7c-.55 0-1 .45-1 1s.45 1 1 1h7c.55 0 1-.45 1-1m-9 8c0 .55.45 1 1 1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7c-.55 0-1 .45-1 1M10.47 4.63c.39.39.39 1.02 0 1.41l-4.23 4.25c-.39.39-1.02.39-1.42 0L2.7 8.16a.996.996 0 1 1 1.41-1.41l1.42 1.42 3.54-3.54c.38-.38 1.02-.38 1.4 0m.01 8.01c.39.39.39 1.02 0 1.41L6.25 18.3c-.39.39-1.02.39-1.42 0L2.7 16.16a.996.996 0 1 1 1.41-1.41l1.42 1.42 3.54-3.54c.38-.38 1.02-.38 1.41.01">\`);
var checklist_default = (props = {}) => (() => {
	var _el$ = _tmpl$$15();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/clear_all.svg
var _tmpl$$14 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M6 13h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1m-2 4h12c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m3-9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1">\`);
var clear_all_default = (props = {}) => (() => {
	var _el$ = _tmpl$$14();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/close.svg
var _tmpl$$13 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4">\`);
var close_default = (props = {}) => (() => {
	var _el$ = _tmpl$$13();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/cloud_download.svg
var _tmpl$$12 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4z">\`);
var cloud_download_default = (props = {}) => (() => {
	var _el$ = _tmpl$$12();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/image_search.svg
var _tmpl$$11 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18 15v4c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h3.02c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1s-1 .45-1 1m-2.5 3H6.52c-.42 0-.65-.48-.39-.81l1.74-2.23a.5.5 0 0 1 .78-.01l1.56 1.88 2.35-3.02c.2-.26.6-.26.79.01l2.55 3.39c.25.32.01.79-.4.79m3.8-9.11c.48-.77.75-1.67.69-2.66-.13-2.15-1.84-3.97-3.97-4.2A4.5 4.5 0 0 0 11 6.5c0 2.49 2.01 4.5 4.49 4.5.88 0 1.7-.26 2.39-.7l2.41 2.41c.39.39 1.03.39 1.42 0s.39-1.03 0-1.42zM15.5 9a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5">\`);
var image_search_default = (props = {}) => (() => {
	var _el$ = _tmpl$$11();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/import_contacts.svg
var _tmpl$$10 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79M21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98z">\`);
var import_contacts_default = (props = {}) => (() => {
	var _el$ = _tmpl$$10();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/menu_book.svg
var _tmpl$$9 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79M21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98z"></path><path d="M13.98 11.01c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.54-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.71-.83.66c-1.62-.19-3.39-.04-4.73.39-.08.01-.16.03-.23.03m0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.71-.83.66c-1.62-.19-3.39-.04-4.73.39a1 1 0 0 1-.23.03m0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.7-.83.66c-1.62-.19-3.39-.04-4.73.39a1 1 0 0 1-.23.03">\`);
var menu_book_default = (props = {}) => (() => {
	var _el$ = _tmpl$$9();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/auto_fix_high.svg
var _tmpl$$8 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="m20.45 6 .49-1.06L22 4.45a.5.5 0 0 0 0-.91l-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05c.17.39.73.39.9 0M8.95 6l.49-1.06 1.06-.49a.5.5 0 0 0 0-.91l-1.06-.48L8.95 2a.492.492 0 0 0-.9 0l-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49L8.05 6c.17.39.73.39.9 0m10.6 7.5-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49.49 1.06a.5.5 0 0 0 .91 0l.49-1.06 1.05-.5a.5.5 0 0 0 0-.91l-1.06-.49-.49-1.06c-.17-.38-.73-.38-.9.01m-1.84-4.38-2.83-2.83a.996.996 0 0 0-1.41 0L2.29 17.46a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0L17.7 10.53c.4-.38.4-1.02.01-1.41m-3.5 2.09L12.8 9.8l1.38-1.38 1.41 1.41z">\`);
var auto_fix_high_default = (props = {}) => (() => {
	var _el$ = _tmpl$$8();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/auto_fix_off.svg
var _tmpl$$7 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="m22 3.55-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05a.5.5 0 0 0 .91 0l.49-1.06L22 4.45c.39-.17.39-.73 0-.9m-7.83 4.87 1.41 1.41-1.46 1.46 1.41 1.41 2.17-2.17a.996.996 0 0 0 0-1.41l-2.83-2.83a.996.996 0 0 0-1.41 0l-2.17 2.17 1.41 1.41zM2.1 4.93l6.36 6.36-6.17 6.17a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l6.17-6.17 6.36 6.36a.996.996 0 1 0 1.41-1.41L3.51 3.51a.996.996 0 0 0-1.41 0c-.39.4-.39 1.03 0 1.42">\`);
var auto_fix_off_default = (props = {}) => (() => {
	var _el$ = _tmpl$$7();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/flash_off.svg
var _tmpl$$6 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M16.12 11.5a.995.995 0 0 0-.86-1.5h-1.87l2.28 2.28zm.16-8.05c.33-.67-.15-1.45-.9-1.45H8c-.55 0-1 .45-1 1v.61l6.13 6.13zm2.16 14.43L4.12 3.56a.996.996 0 1 0-1.41 1.41L7 9.27V12c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l2.65-4.55 3.44 3.44c.39.39 1.02.39 1.41 0 .4-.39.4-1.02.01-1.41">\`);
var flash_off_default = (props = {}) => (() => {
	var _el$ = _tmpl$$6();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/flash_on.svg
var _tmpl$$5 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M7 3v9c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l5.19-8.9a.995.995 0 0 0-.86-1.5H13l2.49-6.65A.994.994 0 0 0 14.56 2H8c-.55 0-1 .45-1 1">\`);
var flash_on_default = (props = {}) => (() => {
	var _el$ = _tmpl$$5();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/lock.svg
var _tmpl$$4 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z">\`);
var lock_default = (props = {}) => (() => {
	var _el$ = _tmpl$$4();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/lock_open.svg
var _tmpl$$3 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m6-5h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75-.14.54.18 1.08.72 1.22a1 1 0 0 0 1.22-.72A2.996 2.996 0 0 1 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m0 11c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-8c0-.55.45-1 1-1h10c.55 0 1 .45 1 1z">\`);
var lock_open_default = (props = {}) => (() => {
	var _el$ = _tmpl$$3();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/userscript/core/useSpeedDial.tsx
const useSpeedDial = ({ store, setState, options, setOptions }) => {
	const OptionButton = (props) => solid_js_web.createComponent(components_IconButton.IconButton, {
		get placement() {
			return store.fab.placement;
		},
		showTip: true,
		get tip() {
			return props.showName ?? (helper.t(\`site.add_feature.\${props.optionName}\`) || helper.t(\`other.\${props.optionName}\`) || props.optionName);
		},
		onClick: () => setOptions({ [props.optionName]: !options[props.optionName] }),
		get children() {
			return props.children ?? (options[props.optionName] ? solid_js_web.createComponent(auto_fix_high_default, {}) : solid_js_web.createComponent(auto_fix_off_default, {}));
		}
	});
	helper.createEffectOn(() => [
		store.fab.optionsSpeedDial,
		store.fab.extraSpeedDial,
		store.fab.overrideSpeedDial
	], () => {
		if (store.fab.overrideSpeedDial) return setState("fab", "speedDial", store.fab.overrideSpeedDial.map((btn) => () => solid_js_web.createComponent(components_IconButton.IconButton, {
			get placement() {
				return store.fab.placement;
			},
			showTip: true,
			get tip() {
				return btn.name;
			},
			get onClick() {
				return btn.onClick;
			},
			get children() {
				return btn.icon({});
			}
		})));
		const list = [() => solid_js_web.createComponent(OptionButton, {
			optionName: "autoShow",
			get showName() {
				return helper.t("site.add_feature.auto_show");
			},
			get children() {
				return solid_js_web.memo(() => !!options.autoShow)() ? solid_js_web.createComponent(flash_on_default, {}) : solid_js_web.createComponent(flash_off_default, {});
			}
		}), () => solid_js_web.createComponent(OptionButton, {
			optionName: "lockOption",
			get showName() {
				return helper.t("site.add_feature.lock_option");
			},
			get children() {
				return solid_js_web.memo(() => !!options.lockOption)() ? solid_js_web.createComponent(lock_default, {}) : solid_js_web.createComponent(lock_open_default, {});
			}
		})];
		if (store.fab.extraSpeedDial) for (const btn of store.fab.extraSpeedDial) list.push(() => solid_js_web.createComponent(components_IconButton.IconButton, {
			get placement() {
				return store.fab.placement;
			},
			showTip: true,
			get tip() {
				return btn.name;
			},
			get onClick() {
				return btn.onClick;
			},
			get children() {
				return btn.icon({});
			}
		}));
		if (store.fab.optionsSpeedDial) for (const optionName of store.fab.optionsSpeedDial) list.push(() => solid_js_web.createComponent(OptionButton, { optionName }));
		else for (const optionName of Object.keys(options)) switch (optionName) {
			case "hiddenFab":
			case "option":
			case "autoShow":
			case "lockOption": continue;
			default: if (typeof options[optionName] === "boolean") list.push(() => solid_js_web.createComponent(OptionButton, { optionName }));
		}
		setState("fab", "speedDial", list);
	});
};
//#endregion
//#region src/userscript/core/useFab.tsx
var _tmpl$$2 = /*#__PURE__*/ solid_js_web.template(\`<div style=text-align:center;line-height:1.2><span style=opacity:0.6;font-size:0.75em></span><br>\`);
const useFab = (coreCtx, nowImgList) => {
	const { store, setState, options, setOptions, showComic } = coreCtx;
	helper.css\`
    #fab {
      --text-bg: transparent;

      position: fixed;
      right: calc(3vw - var(--left, 0px));
      bottom: calc(6vh - var(--top, 0px));
      font-size: clamp(12px, 1.5vw, 16px);
    }
  \`;
	helper.css("#fab", {
		"--left": () => \`\${options.fabPosition.left}px\`,
		"--top": () => \`\${options.fabPosition.top}px\`
	});
	/** 当前已取得 url 的图片数量 */
	const doneImgNum = helper.createRootMemo(() => nowImgList()?.filter(Boolean)?.length);
	/** 已加载完毕的图片数量 */
	const loadedImgNum = helper.createRootMemo(() => {
		let i = 0;
		for (const img of components_Manga.imgList()) if (img.loadType === "loaded") i += 1;
		return i;
	});
	helper.createEffectOn([
		doneImgNum,
		loadedImgNum,
		() => nowImgList()?.length,
		coreCtx.canLoadComic,
		coreCtx.canMultiSelect,
		() => coreCtx.multiSelect?.isEnabled(),
		() => coreCtx.multiSelect?.selectedIds().length,
		() => options.hiddenFab
	], ([doneNum, loadNum, totalNum, canLoadComic, canMultiSelect, enabled, selectedCount, hiddenFab]) => setState((state) => {
		if (enabled || canMultiSelect && !canLoadComic) {
			const ms = coreCtx.multiSelect;
			const isActive = enabled && helper.isNumber(selectedCount);
			state.fab.show = isActive ? true : void 0;
			state.fab.children = isActive ? (() => {
				var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild;
				_el$2.nextSibling;
				solid_js_web.insert(_el$2, () => helper.t("other.selected"));
				solid_js_web.insert(_el$, selectedCount, null);
				return _el$;
			})() : solid_js_web.createComponent(checklist_default, {});
			state.fab.tip = helper.t("hotkeys.multi_select_load");
			state.fab.onClick = ms.load;
			state.fab.overrideSpeedDial = [{
				name: helper.t("other.exit"),
				onClick: ms.unmount,
				icon: close_default
			}, {
				name: helper.t("other.clear"),
				onClick: ms.clear,
				icon: clear_all_default
			}];
			if (doneNum !== void 0 && totalNum !== void 0) state.fab.progress = doneNum / totalNum || 0;
			return;
		}
		state.fab.progress = void 0;
		if (hiddenFab) state.fab.show = false;
		else state.fab.show = canLoadComic || canMultiSelect ? void 0 : false;
		state.fab.onClick = showComic;
		state.fab.overrideSpeedDial = void 0;
		if (totalNum === void 0 || doneNum === void 0) {
			state.fab.children = solid_js_web.createComponent(import_contacts_default, {});
			return;
		}
		if (totalNum === 0) {
			state.fab.children = solid_js_web.createComponent(image_search_default, {});
			state.fab.progress = 0;
			state.fab.tip = \`\${helper.t("other.loading_img")} - \${doneNum}/\${totalNum}\`;
			return;
		}
		if (doneNum < totalNum) {
			state.fab.children = solid_js_web.createComponent(image_search_default, {});
			state.fab.progress = doneNum / totalNum;
			state.fab.tip = \`\${helper.t("other.loading_img")} - \${doneNum}/\${totalNum}\`;
			return;
		}
		if (loadNum < totalNum) {
			state.fab.children = solid_js_web.createComponent(cloud_download_default, {});
			state.fab.progress = 1 + loadNum / totalNum;
			state.fab.tip = \`\${helper.t("other.img_loading")} - \${loadNum}/\${totalNum}\`;
			return;
		}
		state.fab.children = solid_js_web.createComponent(menu_book_default, {});
		state.fab.progress = 1 + loadNum / totalNum;
		state.fab.tip = helper.t("other.read_mode");
	}));
	const handleMount = (ref) => {
		const handleDrag = ({ xy: [x, y], last: [lx, ly] }) => {
			const left = options.fabPosition.left + x - lx;
			const top = options.fabPosition.top + y - ly;
			setOptions({ fabPosition: {
				left,
				top
			} });
		};
		helper.useDrag({
			ref,
			handleDrag,
			setCapture: true
		});
		new IntersectionObserver((entries) => {
			if (entries.length !== 1 || entries[0].isIntersecting) return;
			setOptions({ fabPosition: {
				left: 0,
				top: 0
			} });
		}, { threshold: .5 }).observe(ref);
	};
	helper.mountComponents("fab", () => {
		solid_js.createEffect(() => {
			setState("fab", {
				placement: -options.fabPosition.left < window.innerWidth / 2 ? "left" : "right",
				speedDialPlacement: -options.fabPosition.top < window.innerHeight / 2 ? "top" : "bottom"
			});
		});
		return solid_js_web.createComponent(components_Fab.Fab, solid_js_web.mergeProps({ ref: handleMount }, () => store.fab));
	}).style.setProperty("z-index", "2147483646", "important");
	useSpeedDial(coreCtx);
};
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/sync.svg
var _tmpl$$1 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6 0 .79-.15 1.56-.44 2.25-.15.36-.04.77.23 1.04.51.51 1.37.33 1.64-.34.37-.91.57-1.91.57-2.95 0-4.42-3.58-8-8-8m0 14c-3.31 0-6-2.69-6-6 0-.79.15-1.56.44-2.25.15-.36.04-.77-.23-1.04-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79a.5.5 0 0 0-.85.36z">\`);
var sync_default = (props = {}) => (() => {
	var _el$ = _tmpl$$1();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/userscript/core/migration.ts
const migrationOption = async (name, editFn) => {
	try {
		const option = await GM.getValue(name);
		if (!option) throw new Error(\`GM.getValue Error: not found \${name}\`);
		if (await editFn(option)) return;
		await GM.setValue(name, option);
	} catch (error) {
		helper.log.error(\`migration \${name} option error:\`, error);
	}
};
/** 重命名配置项 */
const renameOption = (name, list) => migrationOption(name, (option) => {
	for (const itemText of list) {
		const [path, newName] = itemText.split(" => ");
		helper.byPath(option, path, (parent, key) => {
			helper.log("rename Option", itemText);
			if (newName) Reflect.set(parent, newName, parent[key]);
			Reflect.deleteProperty(parent, key);
		});
	}
});
/** 旧版本配置迁移 */
const migration = async (version) => {
	await GM.deleteValue("ehTagColorizeCss");
	await GM.deleteValue("ehTagSortCss");
	const values = await GM.listValues();
	if (helper.versionLt(version, "7")) for (const key of values) switch (key) {
		case "Version":
		case "Languages": continue;
		case "HotKeys":
			await renameOption(key, [
				"向上翻页 => turn_page_up",
				"向下翻页 => turn_page_down",
				"向右翻页 => turn_page_right",
				"向左翻页 => turn_page_left",
				"跳至首页 => jump_to_home",
				"跳至尾页 => jump_to_end",
				"退出 => exit",
				"切换页面填充 => switch_page_fill",
				"切换卷轴模式 => switch_scroll_mode",
				"切换单双页模式 => switch_single_double_page_mode",
				"切换阅读方向 => switch_dir",
				"进入阅读模式 => enter_read_mode"
			]);
			break;
		default: await renameOption(key, [
			"option.scrollbar.showProgress => showImgStatus",
			"option.clickPage => clickPageTurn",
			"option.clickPage.overturn => reverse",
			"option.swapTurnPage => swapPageTurnKey",
			"option.flipToNext => jumpToNext",
			"匹配nhentai => associate_nhentai",
			"快捷键翻页 => hotkeys_page_turn",
			"自动翻页 => auto_page_turn",
			"彻底屏蔽漫画 => block_totally",
			"在新页面中打开链接 => open_link_new_page",
			"记住当前站点 => remember_current_site"
		]);
	}
	if (helper.versionLt(version, "9")) for (const key of values) switch (key) {
		case "Version":
		case "Languages": continue;
		case "Hotkeys":
			await renameOption(key, [
				"turn_page_up => ",
				"turn_page_down => ",
				"turn_page_right => scroll_right",
				"turn_page_left => scroll_left"
			]);
			break;
		default: await migrationOption(key, (option) => {
			if (typeof option.option?.scrollMode !== "boolean") return true;
			option.option.scrollMode = {
				enabled: option.option.scrollMode,
				spacing: option.option.scrollModeSpacing,
				imgScale: option.option.scrollModeImgScale,
				fitToWidth: option.option.scrollModeFitToWidth
			};
		});
	}
	if (helper.versionLt(version, "9.4")) await migrationOption("ehentai", (option) => {
		if (!Reflect.has(option, "hotkeys_page_turn")) return true;
		option.hotkeys = option.hotkeys_page_turn;
		Reflect.deleteProperty(option, "hotkeys_page_turn");
	});
	if (helper.versionLt(version, "11.5")) await migrationOption("Hotkeys", (option) => {
		for (const [name, hotkeys] of Object.entries(option)) option[name] = hotkeys.map((key) => key.replaceAll(/\\b[A-Z]\\b/gu, (match) => match.toLowerCase()));
	});
	if (helper.versionLt(version, "11.9.1")) for (const key of values) switch (key) {
		case "Version":
		case "Languages":
		case "Hotkeys": continue;
		default: await renameOption(key, ["option.translation => "]);
	}
	if (helper.versionLt(version, "11.12")) for (const key of values) switch (key) {
		case "Version":
		case "Languages":
		case "Hotkeys": continue;
		default: await renameOption(key, ["associate_nhentai => cross_site_link"]);
	}
	if (helper.versionLt(version, "12")) for (const key of values) switch (key) {
		case "Version":
		case "Languages":
		case "Hotkeys":
			await GM.setValue(\`@\${key}\`, await GM.getValue(key));
			await GM.deleteValue(key);
			continue;
		default: await renameOption(key, ["hotkeys => add_hotkeys_actions"]);
	}
	if (helper.versionLt(version, "12.6")) for (const key of values) {
		if (key.startsWith("@")) continue;
		await migrationOption(key, (option) => {
			const oldTranslation = option.option?.translation;
			if (!oldTranslation) return;
			delete option.option.translation;
			if (oldTranslation.localUrl) {
				option.option.translation ??= {};
				option.option.translation.mit ??= {};
				option.option.translation.mit.localUrl = oldTranslation.localUrl;
			}
		});
	}
};
//#endregion
//#region src/userscript/core/useManga.tsx
let dom;
/**
* 显示漫画阅读窗口
*/
const useManga = ({ store, setState, options, setOptions }) => {
	helper.css\`
    #comicRead {
      position: fixed;
      top: 0;
      left: 0;
      transform: scale(0);

      contain: strict;

      width: 100%;
      height: 100%;

      writing-mode: initial;
      font-size: 16px;

      opacity: 0;

      transition:
        opacity 300ms,
        transform 0s 300ms;
    }

    #comicRead[show] {
      transform: scale(1);
      opacity: 1;
      transition:
        opacity 300ms,
        transform 100ms;
    }

    /* 防止其他扩展的元素显示到漫画上来 */
    #comicRead[show] ~ :not(#fab, #toast, .comicread-ignore) {
      pointer-events: none !important;

      z-index: 1 !important;

      display: none !important;

      visibility: hidden !important;
      opacity: 0 !important;
    }
  \`;
	setState("manga", {
		show: false,
		option: options.option,
		defaultOption: options.defaultOption,
		onOptionChange: (option) => setOptions({ option }),
		hotkeys: store.hotkeys,
		onHotkeysChange(newValue) {
			GM.setValue("@Hotkeys", newValue);
			setState("hotkeys", newValue);
		}
	});
	dom = helper.mountComponents("comicRead", () => solid_js_web.createComponent(components_Manga.Manga, solid_js_web.mergeProps(() => store.manga)));
	dom.style.setProperty("z-index", "2147483647", "important");
	const toastDom = helper.querySelector("#toast");
	if (toastDom) dom.after(toastDom);
	const htmlStyle = document.documentElement.style;
	let lastOverflow = htmlStyle.overflow;
	const wakeLock = new helper.WakeLock();
	helper.createEffectOn(helper.createRootMemo(() => store.manga.show && store.manga.imgList.length > 0), (show) => {
		if (show) {
			dom.setAttribute("show", "");
			lastOverflow = htmlStyle.overflow;
			htmlStyle.setProperty("overflow", "hidden", "important");
			htmlStyle.setProperty("scrollbar-width", "none", "important");
			if (components_Manga.store.option.autoFullscreen) components_Manga.refs.root.requestFullscreen();
			wakeLock.on();
		} else {
			dom.removeAttribute("show");
			htmlStyle.overflow = lastOverflow;
			htmlStyle.removeProperty("scrollbar-width");
			wakeLock.off();
		}
	}, { defer: true });
	setState("manga", {
		onExit: () => setState("manga", "show", false),
		editSettingList(list) {
			const SyncOptions = () => {
				const sync = async () => {
					const currentReadOption = helper.difference(components_Manga.store.option, components_Manga.store.defaultOption);
					for (const key of await GM.listValues()) {
						if (key.startsWith("@")) continue;
						await migrationOption(key, (option) => {
							option.option = currentReadOption;
						});
					}
					components_Toast.toast.success(helper.t("setting.sync_options_other_site"));
				};
				return solid_js_web.createComponent(components_Manga.SettingsItemButton, {
					get name() {
						return helper.t("setting.sync_options_other_site");
					},
					onClick: sync,
					get children() {
						return solid_js_web.createComponent(sync_default, {});
					}
				});
			};
			const otherSetting = list.find(([title]) => title === helper.t("other.other"));
			if (otherSetting) {
				const [, FC] = otherSetting;
				otherSetting[1] = () => [solid_js_web.createComponent(FC, {}), solid_js_web.createComponent(SyncOptions, {})];
			}
			return list;
		}
	});
};
//#endregion
//#region src/userscript/core/version.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<h2>🥳 ComicRead 已更新到 v\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<section><h3></h3><ul>\`);
var _tmpl$3 = /*#__PURE__*/ solid_js_web.template(\`<li>\`);
/** 分组顺序与标题，需与 scripts/lib/changelog.ts 的 changeTypes 保持一致 */
const changeTypes = [
	"feat",
	"fix",
	"perf"
];
const changeSectionTitle = {
	feat: "新增",
	fix: "修复",
	perf: "优化"
};
/** 处理版本更新相关 */
const handleVersionUpdate = async () => {
	const version = await helper.ensureGmValue("@Version", GM.info.script.version);
	if (version === GM.info.script.version) return;
	await migration(version);
	if (helper.lang() === "zh") {
		components_Toast.toast(() => {
			const changes = Object.entries({
				"12.10.0": {
					"date": "2026-09-02",
					"feat": ["支持 pawchive", "实现边缘裁切功能"],
					"fix": ["修复在百合会和 ehentai 上无法自动进入阅读模式的 bug"]
				},
				"12.9.0": {
					"date": "2026-08-21",
					"feat": [
						"增加漫画滤镜功能",
						"支持显示再漫画的评论",
						"支持在卷轴模式下持续滚动"
					]
				},
				"12.8.0": {
					"date": "2026-08-21",
					"feat": [
						"增加滚动动画时长的配置项",
						"增加可配置的翻页滚动动画",
						"优化简易阅读模式的图片选择机制，尽量排除干扰项"
					],
					"fix": ["修复在绅士漫画上的部分网页失效的 bug"]
				},
				"12.7.1": {
					"date": "2026-08-20",
					"fix": ["修复图片加载异常的 bug"]
				},
				"12.7.0": {
					"date": "2026-08-19",
					"feat": ["支持 komiic 的新域名", "增加支持 Postimages"],
					"fix": ["修复在新版 LANraragi 上失效的 bug", "修复在再漫画上无法正常运行的 bug"]
				},
				"12.6.0": {
					"date": "2026-08-16",
					"feat": [
						"双页卷轴模式可以在一行里显示多页",
						"ehentai 画廊支持多选加载指定页",
						"pixiv 支持多选加载",
						"kemono 支持在列表页多选加载"
					],
					"fix": ["修复拷贝漫画的接口错误"]
				}
			}).filter(([changeVersion]) => helper.versionLt(version, changeVersion)).map(([, change]) => change);
			return [(() => {
				var _el$ = _tmpl$();
				_el$.firstChild;
				solid_js_web.insert(_el$, () => GM.info.script.version, null);
				return _el$;
			})(), solid_js_web.createComponent(solid_js.For, {
				each: changeTypes,
				children: (type) => {
					const items = changes.flatMap((change) => change[type] ?? []);
					if (items.length === 0) return null;
					return (() => {
						var _el$3 = _tmpl$2(), _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling;
						solid_js_web.insert(_el$4, () => changeSectionTitle[type]);
						solid_js_web.insert(_el$5, solid_js_web.createComponent(solid_js.For, {
							each: items,
							children: (item) => (() => {
								var _el$6 = _tmpl$3();
								solid_js_web.insert(_el$6, item);
								return _el$6;
							})()
						}));
						return _el$3;
					})();
				}
			})];
		}, {
			id: "Version Tip",
			type: "custom",
			duration: Infinity,
			onDismiss: () => GM.setValue("@Version", GM.info.script.version)
		});
		const listenerId = await GM.addValueChangeListener("@Version", async (_, __, newVersion) => {
			if (newVersion !== GM.info.script.version) return;
			components_Toast.toast.dismiss("Version Tip");
			await GM.removeValueChangeListener(listenerId);
		});
	} else await GM.setValue("@Version", GM.info.script.version);
};
//#endregion
//#region src/userscript/core/useInit.tsx
/** 对基础的初始化操作的封装 */
const useInit = async (name, initSiteOptions = {}) => {
	await helper.setInitLang();
	await handleVersionUpdate();
	const defaultOptions = {
		option: void 0,
		defaultOption: void 0,
		autoShow: true,
		lockOption: false,
		hiddenFab: false,
		fabPosition: {
			top: 0,
			left: 0
		},
		...initSiteOptions
	};
	const saveOptions = await GM.getValue(name);
	if (saveOptions) for (const key of Object.keys(saveOptions)) {
		if (Reflect.has(defaultOptions, key)) continue;
		Reflect.deleteProperty(saveOptions, key);
	}
	else await GM.setValue(name, {});
	const { store, setState } = helper.useStore({
		fab: {
			tip: helper.t("other.read_mode"),
			show: false
		},
		manga: { imgList: [] },
		hotkeys: await GM.getValue("@Hotkeys", {}),
		name,
		options: {
			...structuredClone(defaultOptions),
			...saveOptions
		},
		comicMap: { "": { getImgList: Object.assign(() => [], { type: "init" }) } },
		nowComic: "",
		flag: {
			isStored: saveOptions !== void 0,
			needAutoShow: true,
			hasPageHandler: false
		}
	});
	components_Manga.setDefaultHotkeys((_hotkeys) => ({
		..._hotkeys,
		enter_read_mode: ["v"],
		multi_select_load: ["Shift + v"]
	}));
	const { options } = store;
	const setOptions = (newOptions) => {
		setState((state) => Object.assign(state.options, newOptions));
		if (options.lockOption && newOptions?.lockOption !== false) return;
		return GM.setValue(store.name, helper.difference(options, defaultOptions));
	};
	const loadComic = async (id = store.nowComic) => {
		if (!Reflect.has(store.comicMap, id)) throw new Error("comic not found");
		try {
			setState("comicMap", id, "imgList", []);
			const newImgList = await store.comicMap[id].getImgList(coreCtx);
			if (newImgList.length === 0) throw new Error(helper.t("alert.fetch_comic_img_failed"));
			setState("comicMap", id, "imgList", newImgList);
		} catch (error) {
			setState("comicMap", id, "imgList", void 0);
			helper.log.error(error);
			throw error;
		}
	};
	const showComic = async (id = store.nowComic) => {
		if (!Reflect.has(store.comicMap, id)) throw new Error("comic not found");
		if (store.comicMap[id].getImgList?.type === "init") return;
		if (id !== store.nowComic) setState("nowComic", id);
		switch (store.comicMap[id].imgList?.length) {
			case 0: return components_Toast.toast.warn(helper.t("alert.repeat_load"), { duration: 1500 });
			case void 0: try {
				await loadComic(id);
				setState("flag", "needAutoShow", false);
			} catch (error) {
				return components_Toast.toast.error(error.message);
			}
		}
		setState("manga", "show", true);
	};
	const init = helper.once((autoShow = true) => {
		setState("fab", { onClick: () => void showComic() });
		if (autoShow && store.flag.needAutoShow && options.autoShow) showComic();
		(async () => {
			await GM.registerMenuCommand(helper.t("other.enter_comic_read_mode"), () => void showComic());
			await updateHideFabMenu();
		})();
		components_Manga.listenHotkey({
			enter_read_mode: () => showComic(),
			Escape: () => handleEsc() || "SKIP"
		}, true);
	});
	helper.createEffectOn(() => store.comicMap[""].getImgList, (_, prev) => !prev && init(), { defer: true });
	const canLoadComic = helper.createRootMemo(() => Object.values(store.comicMap).some((entry) => entry.getImgList?.type === void 0));
	const [multiSelect, setMultiSelect] = solid_js.createSignal();
	const coreCtx = {
		store,
		setState,
		options,
		setOptions,
		loadComic,
		showComic,
		init,
		canLoadComic,
		canMultiSelect: helper.createRootMemo(() => Boolean(multiSelect())),
		get multiSelect() {
			return multiSelect();
		},
		setMultiSelect,
		dynamicLoad: async (loadImgFn, length, id = "") => {
			if (store.comicMap[id].imgList?.length) return store.comicMap[id].imgList;
			const imgNum = typeof length === "number" ? length : length();
			setState("comicMap", id, "imgList", helper.range(imgNum, ""));
			await new Promise(async (resolve) => {
				try {
					await loadImgFn((i, img) => {
						setState("comicMap", id, "imgList", (list) => list.with(i, img));
						resolve();
					});
				} catch (error) {
					components_Toast.toast.error(error.message);
				}
			});
			return store.comicMap[id].imgList;
		},
		dynamicLazyLoad: async ({ loadImg, length, id = "", concurrency = 4 }) => {
			if (store.comicMap[id].imgList?.length) return store.comicMap[id].imgList;
			const imgNum = typeof length === "number" ? length : length();
			await new Promise((resolve) => {
				const queue = new helper.PQueue(async (i) => {
					const img = await loadImg(i);
					setState("comicMap", id, "imgList", (list) => list.with(i, img));
					resolve();
				}, concurrency);
				setState((state) => {
					state.comicMap[id].imgList = helper.range(imgNum, "");
					state.manga.onWaitUrlImgs = (imgs) => queue.set(...imgs);
				});
			});
			return store.comicMap[id].imgList;
		}
	};
	const nowImgList = helper.createRootMemo(() => {
		const comic = store.comicMap[store.nowComic];
		if (!comic?.imgList) return;
		if (!comic.adList?.size) return comic.imgList;
		return comic.imgList.filter((_, i) => !comic.adList?.has(i));
	});
	helper.createEffectOn(nowImgList, (list) => list && setState("manga", "imgList", list));
	useFab(coreCtx, nowImgList);
	useManga(coreCtx);
	let menuId;
	/** 更新显示/隐藏悬浮按钮的菜单项 */
	const updateHideFabMenu = async () => {
		await GM.unregisterMenuCommand(menuId);
		menuId = await GM.registerMenuCommand(options.hiddenFab ? helper.t("other.fab_show") : helper.t("other.fab_hidden"), () => {
			setOptions({ hiddenFab: !options.hiddenFab });
			return updateHideFabMenu();
		});
	};
	await GM.registerMenuCommand(helper.t("site.show_settings_menu"), () => setState("fab", {
		show: true,
		focus: true,
		tip: helper.t("other.setting"),
		children: solid_js_web.createComponent(settings_default, {}),
		onBackdropClick: () => setState("fab", {
			show: false,
			focus: false
		})
	}));
	return coreCtx;
};
//#endregion
//#region src/userscript/core/siteAdapter.ts
/** 快速适配简单网站 */
const setup = async ({ name, initOptions, isMangaPage, getImgList, onPrev, onNext, onExit, handler: userHandler }) => {
	await setupSiteAdapter({
		name,
		options: initOptions,
		getPageContext: async () => {
			const data = isMangaPage ? await isMangaPage() : {};
			if (!data) return;
			return {
				type: "manga",
				...data === true ? {} : data
			};
		},
		handlers: { manga: async (coreCtx, pageCtx) => {
			const { setState } = coreCtx;
			setState((state) => {
				state.comicMap[""] = { getImgList: (ctx) => getImgList(ctx, pageCtx) };
				state.manga.onExit = (isEnd) => {
					onExit?.(isEnd);
					setState("manga", "show", false);
				};
			});
			await userHandler?.(coreCtx, pageCtx);
			(async () => {
				if (onPrev) setState("manga", { onPrev: await helper.wait(onPrev, 5e3) });
				if (onNext) setState("manga", { onNext: await helper.wait(onNext, 5e3) });
			})();
		} }
	});
};
const setupSiteAdapter = async ({ name, options: initOptions, getPageContext, handlers, features }) => {
	let pageCtx;
	const cleanupFns = [];
	pageCtx = await helper.waitUrlChange(() => getPageContext(pageCtx));
	const coreCtx = await useInit(name, initOptions);
	const { store, setState, showComic, loadComic, init, options } = coreCtx;
	const processPageContext = async (newPageCtx, force = false) => {
		if (!force && helper.isEqual(pageCtx, newPageCtx)) return;
		for (const cleanup of cleanupFns) await cleanup(newPageCtx);
		cleanupFns.length = 0;
		pageCtx = newPageCtx;
		const isMangePage = newPageCtx?.isManga ?? newPageCtx?.type === "manga";
		setState((state) => {
			state.flag.hasPageHandler = Boolean(newPageCtx?.type) && Reflect.has(handlers, newPageCtx.type);
			state.manga.show = false;
			state.comicMap = { "": { getImgList: Object.assign(() => [], { type: "init" }) } };
		});
		if (!newPageCtx) return;
		init(isMangePage);
		const allCleanup = await handlers.all?.(coreCtx, newPageCtx);
		if (allCleanup) cleanupFns.push(allCleanup);
		const handlerCleanup = await handlers[newPageCtx.type]?.(coreCtx, newPageCtx);
		if (handlerCleanup) cleanupFns.push(handlerCleanup);
		if (features) for (const [featureName, handler] of Object.entries(features)) {
			if (!options[featureName] || !handler) continue;
			helper.requestIdleCallback(async () => {
				const cleanup = await handler(coreCtx, newPageCtx);
				if (cleanup && pageCtx === newPageCtx) cleanupFns.push(cleanup);
			}, 1e3);
		}
		if (!isMangePage || !store.options.autoShow) return;
		const lastImg = store.comicMap[store.nowComic].imgList?.[0];
		if (await helper.wait(async () => {
			await helper.sleep(200);
			await loadComic();
			return store.comicMap[store.nowComic].imgList?.[0] !== lastImg;
		}, 1e4)) await showComic();
	};
	helper.onUrlChange(async (lastUrl) => {
		if (!lastUrl) return await processPageContext(pageCtx, true);
		await processPageContext(await getPageContext(pageCtx));
	});
};
/** 适配「将所有图片显示在一个页面上」的网站 */
const setupSimple = async ({ name, initOptions, isMangaPage, onPrev, onNext, onExit, selector, sortImageByTop }) => {
	let scanner;
	await setupSiteAdapter({
		name,
		options: initOptions,
		getPageContext: async () => {
			if (isMangaPage) {
				const data = await isMangaPage();
				if (!data) return;
				return {
					type: "manga",
					...data === true ? {} : data
				};
			}
			if (selector && !await helper.waitDom(selector, 2, 1e3)) return;
			return { type: "manga" };
		},
		handlers: { manga: ({ setState, store }) => {
			scanner ??= new userscript_autoImageScanner.AutoImageScanner({
				selector,
				sortImageByTop,
				onImgListChange: (imgList) => setState("comicMap", "", "imgList", imgList),
				onChapterSwitchChange: async ({ prev, next }) => {
					const customPrev = onPrev ? await onPrev() : void 0;
					const customNext = onNext ? await onNext() : void 0;
					setState("manga", {
						onPrev: customPrev ?? prev,
						onNext: customNext ?? next
					});
				},
				shouldTriggerLazyLoad: () => store.manga.show || store.manga.imgList.length === 0
			});
			setState((state) => {
				state.comicMap[""] = { getImgList: () => {
					scanner.start();
					scanner.triggerLazyLoad();
					return scanner.waitFirstImage(1e4);
				} };
				state.manga.onExit = (isEnd) => {
					onExit?.(isEnd);
					setState("manga", "show", false);
				};
			});
			helper.createEffectOn(() => store.manga.show, (show) => show && void scanner.triggerLazyLoad());
			return () => scanner.stop();
		} }
	});
};
//#endregion
exports.handleEsc = handleEsc;
exports.handleVersionUpdate = handleVersionUpdate;
exports.listenHotkey = components_Manga.listenHotkey;
exports.registerEsc = registerEsc;
exports.request = request.request;
exports.setEscPriority = setEscPriority;
exports.setup = setup;
exports.setupSimple = setupSimple;
exports.setupSiteAdapter = setupSiteAdapter;
exports.toast = components_Toast.toast;
exports.useInit = useInit;
exports.useSpeedDial = useSpeedDial;
`,
	"userscript/autoImageScanner": `\nlet helper = require("helper");
//#region src/userscript/autoImageScanner/chapterSwitch.ts
const prevRe = /^上一?(?:[章話话]|章节)$|^(?:prev|previous)(?:\\s+chapter)?$|^前の章$/iu;
const nextRe = /^下一?(?:[章話话]|章节)$|^next(?:\\s+chapter)?$|^次の章$/iu;
const getChapterSwitch = () => {
	let onPrev;
	let onNext;
	const checkElement = (e) => {
		const texts = [e.textContent, e.ariaLabel].filter(Boolean).map((text) => text.replaceAll(/[<>()《》（）「」『』]/gu, "").trim());
		if (texts.length === 0) return;
		for (const text of texts) {
			if (!onPrev && prevRe.test(text)) {
				onPrev = () => e.click();
				break;
			}
			if (!onNext && nextRe.test(text)) {
				onNext = () => e.click();
				break;
			}
		}
	};
	for (const e of helper.querySelectorAll("a, button")) {
		checkElement(e);
		if (onPrev && onNext) break;
		for (const element of e.querySelectorAll("div, span, p")) {
			checkElement(element);
			if (onPrev && onNext) break;
		}
	}
	return {
		next: onNext,
		prev: onPrev
	};
};
//#endregion
//#region src/userscript/autoImageScanner/eleSelector.ts
const getTagText = (ele) => {
	let text = ele.nodeName;
	if (ele.id && !/\\d/u.test(ele.id)) text += \`#\${ele.id}\`;
	return text;
};
/** 获取元素仅记录了层级结构关系的选择器 */
const getEleSelector = (ele) => {
	const parents = [ele.nodeName];
	const root = ele.getRootNode();
	let e = ele;
	while (e.parentNode && e.parentNode !== root) {
		e = e.parentNode;
		parents.push(getTagText(e));
	}
	return parents.toReversed().join(">");
};
/** 判断指定元素是否符合选择器 */
const isEleSelector = (ele, selector) => {
	const parents = selector.split(">").toReversed();
	let e = ele;
	for (let i = 0; e && i < parents.length; i++) {
		if (getTagText(e) !== parents[i]) return false;
		e = e.parentNode;
	}
	return e === e.getRootNode();
};
//#endregion
//#region src/userscript/autoImageScanner/helper.ts
/** 按照元素的显示高度来排序元素 */
const sortElementsByTop = (elements) => {
	const list = [...elements];
	const topMap = /* @__PURE__ */ new WeakMap();
	for (const e of list) topMap.set(e, e.getBoundingClientRect().top);
	return list.sort((a, b) => topMap.get(a) - topMap.get(b));
};
/** 按照文档顺序来排序元素 */
const sortElementsByDomOrder = (elements) => [...elements].sort((a, b) => {
	const position = a.compareDocumentPosition(b);
	if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
	if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
	return 0;
});
/** 处理 URL.createObjectURL 后马上 URL.revokeObjectURL 的图片 */
var BlobUrlResolver = class {
	blobUrlMap = /* @__PURE__ */ new Map();
	async resolve(e) {
		if (this.blobUrlMap.has(e.src)) return this.blobUrlMap.get(e.src);
		if (!e.src.startsWith("blob:")) return this.httpToHttps(e.src);
		if (await helper.testImgUrl(e.src)) return e.src;
		const canvas = new OffscreenCanvas(e.naturalWidth, e.naturalHeight);
		canvas.getContext("2d").drawImage(e, 0, 0);
		const url = URL.createObjectURL(await helper.canvasToBlob(canvas));
		this.blobUrlMap.set(e.src, url);
		return url;
	}
	clear() {
		this.blobUrlMap.clear();
	}
	/** 在 https 页面下将 http 图片地址升级为 https */
	httpToHttps(url) {
		if (url.startsWith("http:") && location.protocol === "https:") return url.replace("http:", "https:");
		return url;
	}
};
/** 检测重复的加载占位图，用真实地址替换 */
var PlaceholderImgList = class {
	/** 已判定为重复占位图的 URL 集合 */
	set = /* @__PURE__ */ new Set();
	has(url) {
		return this.set.has(url);
	}
	update(imgList) {
		const countMap = /* @__PURE__ */ new Map();
		for (const url of imgList) {
			if (!url || this.set.has(url)) continue;
			const count = (countMap.get(url) ?? 0) + 1;
			countMap.set(url, count);
			if (count > 5) this.set.add(url);
		}
	}
	clear() {
		this.set.clear();
	}
};
//#endregion
//#region src/userscript/autoImageScanner/dwellWatcher.ts
/** 轮询检查可见元素持续时长的间隔 */
const DWELL_CHECK_INTERVAL = 100;
/** 监视元素进入视口后的连续可见时长，并在达到指定时长后触发回调 */
var DwellWatcher = class {
	stateMap = /* @__PURE__ */ new WeakMap();
	visibleSet = /* @__PURE__ */ new Set();
	checkTimer;
	observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			const e = entry.target;
			const state = this.stateMap.get(e);
			if (!state) continue;
			if (entry.isIntersecting) {
				this.visibleSet.add(e);
				if (state.enterTime === void 0) state.enterTime = performance.now();
				this.ensureTimer();
			} else {
				this.visibleSet.delete(e);
				state.enterTime = void 0;
				this.stopTimerIfNeeded();
			}
		}
	});
	watch(e, duration, callback) {
		this.unwatch(e);
		this.stateMap.set(e, {
			duration,
			callback
		});
		this.observer.observe(e);
	}
	unwatch(e) {
		this.visibleSet.delete(e);
		this.stopTimerIfNeeded();
		if (this.stateMap.delete(e)) this.observer.unobserve(e);
	}
	get visibleElements() {
		return this.visibleSet;
	}
	/** 有可见元素时启动轮询，没有可见元素时停止轮询 */
	ensureTimer() {
		if (this.checkTimer === void 0 && this.visibleSet.size > 0) this.checkTimer = window.setInterval(() => this.checkVisibleElements(), DWELL_CHECK_INTERVAL);
	}
	stopTimerIfNeeded() {
		if (this.checkTimer !== void 0 && this.visibleSet.size === 0) {
			window.clearInterval(this.checkTimer);
			this.checkTimer = void 0;
		}
	}
	checkVisibleElements() {
		for (const e of this.visibleSet) {
			const state = this.stateMap.get(e);
			if (!state) continue;
			if (state.enterTime === void 0) {
				state.enterTime = performance.now();
				continue;
			}
			if (performance.now() - state.enterTime >= state.duration) {
				this.unwatch(e);
				state.callback();
			}
		}
	}
};
//#endregion
//#region src/userscript/autoImageScanner/triggerLazyLoad.ts
/** 新元素短停留时间 */
const SHORT_STAY_TIME = 310;
/** 旧元素长停留时间 */
const LONG_STAY_TIME = 1010;
/** 旧元素超过该时间后，即使有新元素也会优先进行长停留 */
const OLD_TIMEOUT = 5e3;
/** 每轮之间的间隔 */
const ROUND_INTERVAL = 100;
/** 触发网页底部翻页的停留时间 */
const TURN_PAGE_WAIT_TIME = 600;
/** 触发网页底部翻页的节流时间 */
const TURN_PAGE_THROTTLE_TIME = 1e3;
/** 用于判断是否是图片 url 的正则 */
const isImgUrlRe = /^(?:(?:(?:https?|ftp|file):)?\\/)?\\/[-\\w+&@#/%?=~|!:,.;]+[-\\w+&@#%=~|]$/u;
/** 找出格式为图片 url 的元素属性 */
const getDatasetUrl = (e) => {
	for (const key of e.getAttributeNames()) {
		switch (key) {
			case "src":
			case "alt":
			case "class":
			case "style":
			case "id":
			case "title":
			case "onload":
			case "onerror": continue;
		}
		const val = e.getAttribute(key).trim();
		if (!isImgUrlRe.test(val)) continue;
		return val;
	}
};
/** 判断一个元素是否已经成功触发完懒加载 */
const isLazyLoaded = (e, oldSrc) => {
	if (!e.isConnected || !e.checkVisibility()) return true;
	if (helper.isImageElement(e)) {
		if (!e.src) return false;
		if (!e.offsetParent) return false;
		if (e.src.startsWith("data:image/svg")) return false;
		if (e.naturalWidth > 500 || e.naturalHeight > 500) return true;
		if (oldSrc !== void 0 && e.src !== oldSrc) return true;
	} else {
		const imgDomList = e.querySelectorAll("img");
		for (const imgDom of imgDomList) if (isLazyLoaded(imgDom, oldSrc)) return true;
	}
	return false;
};
var LazyLoadManager = class {
	/** 懒加载失败回调 */
	onFailed;
	/** 当前是否允许触发懒加载 */
	runCondition = () => true;
	/** 记录元素的初始 src */
	oldSrcMap = /* @__PURE__ */ new WeakMap();
	/** 未完成短停留的新元素 */
	newSet = /* @__PURE__ */ new Set();
	/** 已完成短停留但未完成长停留的旧元素，value 为短停留完成时间 */
	oldMap = /* @__PURE__ */ new Map();
	/** 长停留后仍未成功触发懒加载，判定为非图片槽位的元素 */
	failedSet = /* @__PURE__ */ new WeakSet();
	dwellWatcher = new DwellWatcher();
	/** 触发网页底部翻页的节流 */
	turnPageScheduled = helper.createScheduled((fn) => helper.throttle(fn, TURN_PAGE_THROTTLE_TIME));
	trigger = helper.singleThreaded(async (_state, targets) => {
		this.addTargets(targets);
		await this.runRounds();
	});
	/** 判断图片元素是否需要触发懒加载 */
	needTrigger(e) {
		return !isLazyLoaded(e, this.oldSrcMap.get(e)) && !this.failedSet.has(e);
	}
	/** 判断元素是否已经被判定为不可能是图片槽位 */
	isLazyLoadFailed(e) {
		return this.failedSet.has(e);
	}
	/** 将目标元素加入待触发集合 */
	addTargets(targets) {
		for (const e of targets) {
			if (this.failedSet.has(e) || !e.isConnected || !e.checkVisibility()) continue;
			if (helper.isImageElement(e) && !this.oldSrcMap.has(e)) this.oldSrcMap.set(e, e.src);
			const oldSrc = this.oldSrcMap.get(e);
			const datasetUrl = getDatasetUrl(e);
			if (datasetUrl) e.setAttribute("src", datasetUrl);
			if (isLazyLoaded(e, oldSrc)) continue;
			if (this.oldMap.has(e) || this.newSet.has(e)) continue;
			this.newSet.add(e);
			this.dwellWatcher.watch(e, SHORT_STAY_TIME, () => this.handleShortCompleted(e));
		}
	}
	/** 短停留完成的回调 */
	handleShortCompleted = (e) => {
		if (!this.newSet.delete(e)) return;
		if (isLazyLoaded(e, this.oldSrcMap.get(e))) return;
		this.oldMap.set(e, Date.now());
		this.dwellWatcher.watch(e, LONG_STAY_TIME, () => this.handleLongCompleted(e));
	};
	/** 长停留完成的回调 */
	handleLongCompleted = (e) => {
		if (!this.oldMap.delete(e)) return;
		if (isLazyLoaded(e, this.oldSrcMap.get(e))) return;
		this.failedSet.add(e);
		this.onFailed?.(e);
	};
	/** 移除元素并取消观察 */
	removeElement(e) {
		this.dwellWatcher.unwatch(e);
		this.newSet.delete(e);
		this.oldMap.delete(e);
	}
	/** 清理已不在页面上或已经完成懒加载的元素 */
	prune() {
		for (const e of this.newSet) if (isLazyLoaded(e, this.oldSrcMap.get(e))) this.removeElement(e);
		for (const e of this.oldMap.keys()) if (isLazyLoaded(e, this.oldSrcMap.get(e))) this.removeElement(e);
	}
	/** 获取超过超时时间的旧元素 */
	getDueOld() {
		const now = Date.now();
		return [...this.oldMap.entries()].filter(([, shortCompletedAt]) => now - shortCompletedAt >= OLD_TIMEOUT).map(([e]) => e);
	}
	/** 按 DOM 顺序排序 */
	sortByDomOrder(list) {
		return list.toSorted((a, b) => {
			if (a === b) return 0;
			return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
		});
	}
	/** 扫描所有新元素，让它们完成短停留 */
	async sweepNew() {
		this.prune();
		const targets = this.sortByDomOrder([...this.newSet]);
		for (const e of targets) {
			if (!this.newSet.has(e)) continue;
			this.scrollToElement(e);
			await this.waitForBatch((target) => this.newSet.has(target), SHORT_STAY_TIME);
		}
	}
	/** 扫描指定旧元素，让它们完成长停留 */
	async sweepOld(targets) {
		this.prune();
		const sorted = this.sortByDomOrder(targets);
		for (const e of sorted) {
			if (!this.oldMap.has(e)) continue;
			this.scrollToElement(e);
			await this.waitForBatch((target) => this.oldMap.has(target), LONG_STAY_TIME);
		}
	}
	/**
	* 等待当前视口内所有待处理元素完成对应停留。
	*
	* 如果待处理元素已离开视口或已从对应集合中移除，则提前结束等待。
	*/
	async waitForBatch(isPending, duration) {
		await helper.sleep(20);
		await helper.wait(() => [...this.dwellWatcher.visibleElements].some(isPending) ? void 0 : true, duration, 50);
	}
	/** 滚动到元素顶部并派发 scroll 事件，触发网站懒加载 */
	scrollToElement(e) {
		e.scrollIntoView({
			behavior: "instant",
			block: "start"
		});
		e.dispatchEvent(new Event("scroll", { bubbles: true }));
	}
	/** 触发网页底部翻页 */
	triggerTurnPage = async () => {
		if (!this.turnPageScheduled()) return;
		const nowScroll = window.scrollY;
		window.scroll({
			top: document.body.scrollHeight,
			behavior: "instant"
		});
		document.body.dispatchEvent(new Event("scroll", { bubbles: true }));
		await helper.sleep(TURN_PAGE_WAIT_TIME);
		if (this.runCondition()) window.scroll({
			top: nowScroll,
			behavior: "instant"
		});
	};
	/**
	* 执行完整的懒加载轮次
	*
	* 对每个元素执行短停留（初始快速尝试触发）和长停留（保险起见的二次尝试），
	* 两次停留后都无法触发懒加载的，判定其不是图片槽位
	*/
	async runRounds() {
		const startScroll = window.scrollY;
		try {
			while (true) {
				if (!this.runCondition()) return;
				this.prune();
				if (this.newSet.size === 0 && this.oldMap.size === 0) return await this.triggerTurnPage();
				const hadNew = this.newSet.size > 0;
				const startNewSize = this.newSet.size;
				const startOldSize = this.oldMap.size;
				if (this.newSet.size > 0) await this.sweepNew();
				if (this.oldMap.size > 0) {
					const dueOld = this.getDueOld();
					if (dueOld.length > 0) await this.sweepOld(dueOld);
				}
				if (!hadNew && this.oldMap.size > 0) await this.sweepOld([...this.oldMap.keys()]);
				this.prune();
				const changed = this.newSet.size < startNewSize || this.oldMap.size < startOldSize;
				if (this.newSet.size === 0 && this.oldMap.size === 0) return await this.triggerTurnPage();
				if (!changed) return await this.triggerTurnPage();
				await this.triggerTurnPage();
				await helper.sleep(ROUND_INTERVAL);
			}
		} finally {
			if (this.runCondition()) window.scroll({
				top: startScroll,
				behavior: "instant"
			});
		}
	}
};
const lazyLoadTrigger = new LazyLoadManager();
helper.exposeToGlobal({ lazyLoadTrigger });
const triggerLazyLoad = lazyLoadTrigger.trigger;
const needTrigger = (e) => lazyLoadTrigger.needTrigger(e);
const isLazyLoadFailed = (e) => lazyLoadTrigger.isLazyLoadFailed(e);
//#endregion
//#region src/userscript/autoImageScanner/imageSlot.ts
/** 判断两个元素的 dataset 是否具有相同的键结构 */
const hasSameDatasetStructure = (a, b) => {
	const keysA = Object.keys(a.dataset);
	const keysB = Object.keys(b.dataset);
	if (keysA.length !== keysB.length) return false;
	return keysA.every((key) => keysB.includes(key));
};
/** 判断两个元素是否相似 */
const isSimilarElement = (a, b) => a === b || a.className && a.className === b.className || hasSameDatasetStructure(a, b);
const SKIP_TAGS = /* @__PURE__ */ new Set([
	"SCRIPT",
	"STYLE",
	"NOSCRIPT",
	"IFRAME",
	"HEAD",
	"TEMPLATE"
]);
/** 判断元素是否为明显不可能是图片槽位 */
const isImageHostIneligible = (element) => {
	if (!element.checkVisibility()) return true;
	if (helper.isImageElement(element)) return false;
	if (SKIP_TAGS.has(element.tagName)) return true;
	if (element.children.length === 0) return true;
	if (isLazyLoadFailed(element)) return true;
	return false;
};
/** 判断元素是否具有足够的尺寸 */
const hasValidSize = (element) => {
	const rect = element.getBoundingClientRect();
	return rect.width >= 100 && rect.height >= 100;
};
/** 查找最近一层的「与当前元素相似」且数量足够的兄弟图片槽位 */
const findSimilarImageSlots = (element, threshold) => {
	let current = element;
	while (current?.parentElement) {
		const siblingList = current.parentElement.children;
		if (siblingList.length >= threshold) {
			const similarElements = [];
			for (const sibling of siblingList) {
				if (!(sibling instanceof HTMLElement) || !isSimilarElement(sibling, current) || isImageHostIneligible(sibling) || !helper.isImageElement(sibling) && !hasValidSize(sibling)) continue;
				similarElements.push(sibling);
			}
			if (similarElements.length >= threshold) return similarElements;
		}
		current = current.parentElement;
	}
	return [];
};
/** 收集一个槽位内所有已通过 filterImg 的图片 */
const addSlotImgs = (slot, rawImgSet, coveredImgs) => {
	for (const innerImg of slot.querySelectorAll("img")) if (rawImgSet.has(innerImg)) coveredImgs.add(innerImg);
};
/** 从所有合格图片中找出所有图片槽位组 */
const findImageSlotGroups = (map) => {
	const rawImgs = [...map.keys()];
	const rawImgSet = new Set(rawImgs);
	const coveredImgSet = /* @__PURE__ */ new Set();
	const groups = [];
	for (const img of rawImgs) {
		if (coveredImgSet.has(img)) continue;
		const slots = findSimilarImageSlots(img, 5);
		if (slots.length === 0) continue;
		const parent = slots[0].parentElement;
		if (!parent) continue;
		let medianAreaCache;
		const group = {
			parent,
			slots: new Set(slots),
			coveredImgs: /* @__PURE__ */ new Set(),
			get imgNum() {
				return this.coveredImgs.size;
			},
			get medianArea() {
				medianAreaCache ??= getGroupMedianArea(group, map);
				return medianAreaCache;
			}
		};
		for (const slot of slots) if (helper.isImageElement(slot)) {
			if (rawImgSet.has(slot)) group.coveredImgs.add(slot);
		} else addSlotImgs(slot, rawImgSet, group.coveredImgs);
		for (const coveredImg of group.coveredImgs) coveredImgSet.add(coveredImg);
		groups.push(group);
	}
	return groups;
};
/** 从多个图片槽位组中选择最可能属于正文的一组 */
const pickBestGroup = (groups) => groups.reduce((best, current) => {
	if (current.imgNum !== best.imgNum) return current.imgNum > best.imgNum ? current : best;
	return current.medianArea > best.medianArea ? current : best;
});
/** 计算所有图片槽位组，并同时返回当前最优组 */
const getImageSlotGroupResult = (map) => {
	const groups = findImageSlotGroups(map);
	return {
		groups,
		bestGroup: groups.length > 0 ? pickBestGroup(groups) : void 0
	};
};
/** 计算组内图片显示面积的中位数 */
const getGroupMedianArea = (group, map) => {
	const areas = [...group.coveredImgs].map((img) => {
		const info = map.get(img);
		return info ? info.display.width * info.display.height : 0;
	}).sort((a, b) => a - b);
	if (areas.length === 0) return 0;
	const mid = Math.floor(areas.length / 2);
	return areas.length % 2 === 1 ? areas[mid] : (areas[mid - 1] + areas[mid]) / 2;
};
/** 将图片槽位组展开为展示用槽位列表 */
const buildSlotElementsFromGroup = (group) => {
	const slotElements = [];
	const slotImgsMap = /* @__PURE__ */ new Map();
	for (const img of group.coveredImgs) {
		let node = img.parentElement;
		while (node && node !== group.parent && node.parentElement !== group.parent) node = node.parentElement;
		if (!node || node === group.parent) continue;
		const imgs = slotImgsMap.get(node) ?? [];
		imgs.push(img);
		slotImgsMap.set(node, imgs);
	}
	for (const slot of group.slots) {
		if (helper.isImageElement(slot)) {
			if (group.coveredImgs.has(slot)) slotElements.push(slot);
			continue;
		}
		const imgs = slotImgsMap.get(slot);
		if (imgs && imgs.length > 0) slotElements.push(...imgs);
		else slotElements.push(slot);
	}
	return slotElements;
};
//#endregion
//#region src/userscript/autoImageScanner/imageListBuilder.ts
/** 根据合格图片集合和最优图片槽位组，维护最终可用的 imgList */
var ImageListBuilder = class {
	enableSortImageByTop;
	filterByContainer;
	onImgListChange;
	onEmpty;
	blobUrlResolver = new BlobUrlResolver();
	placeholderImgList = new PlaceholderImgList();
	updatePlaceholderImgList = helper.throttle((imgList) => {
		this.placeholderImgList.update(imgList);
	});
	isUpdatingImgList = false;
	generation = 0;
	updateSeq = 0;
	/** 过滤后真正用于展示的图片槽位列表 */
	_slotElements = [];
	/** 找到的所有符合条件的图片 url */
	_imgList = [];
	constructor(options) {
		this.enableSortImageByTop = options.enableSortImageByTop;
		this.filterByContainer = options.filterByContainer;
		this.onImgListChange = options.onImgListChange;
		this.onEmpty = options.onEmpty;
	}
	/** 当前过滤后真正用于展示的图片槽位列表 */
	get slotElements() {
		return this._slotElements;
	}
	/** 当前找到的所有符合条件的图片 url */
	get imgList() {
		return this._imgList;
	}
	/** 根据最新合格图片集合和最优槽位组，更新 slotElements 与 imgList */
	async update(qualifiedMap, bestGroup, generation) {
		const seq = ++this.updateSeq;
		this.generation = generation;
		const selectedSlots = this.filterByContainer && bestGroup ? buildSlotElementsFromGroup(bestGroup) : [...qualifiedMap.keys()];
		this._slotElements = this.enableSortImageByTop ? sortElementsByTop(selectedSlots) : sortElementsByDomOrder(selectedSlots);
		if (this._slotElements.length === 0) {
			this.onEmpty?.();
			return {
				isEdited: false,
				isEmpty: true
			};
		}
		if (this._imgList.length < this._slotElements.length) this._imgList = [...this._imgList, ...Array.from({ length: this._slotElements.length - this._imgList.length }, () => "")];
		else if (this._imgList.length > this._slotElements.length) this._imgList = this._imgList.slice(0, this._slotElements.length);
		this.onImgListChange?.([...this._imgList]);
		this.updatePlaceholderImgList(this._imgList);
		let isEdited = false;
		this.isUpdatingImgList = true;
		try {
			await helper.plimit(this._slotElements.map((e, i) => async () => {
				if (seq !== this.updateSeq || generation !== this.generation) return;
				if (!helper.isImageElement(e)) {
					if (this._imgList[i] === "") return;
					isEdited ||= true;
					this._imgList[i] = "";
					return;
				}
				let newUrl = await this.blobUrlResolver.resolve(e);
				if (seq !== this.updateSeq || generation !== this.generation) return;
				if (this.placeholderImgList.has(newUrl)) newUrl = getDatasetUrl(e) ?? "";
				if (newUrl === this._imgList[i]) return;
				isEdited ||= true;
				this._imgList[i] = newUrl;
			}));
		} finally {
			if (seq === this.updateSeq) this.isUpdatingImgList = false;
		}
		if (seq !== this.updateSeq || generation !== this.generation) return {
			isEdited: false,
			isEmpty: true
		};
		this.removeFailedSlots();
		if (this._slotElements.length === 0) return {
			isEdited,
			isEmpty: true
		};
		if (seq !== this.updateSeq || generation !== this.generation) return {
			isEdited: false,
			isEmpty: true
		};
		return {
			isEdited,
			isEmpty: false
		};
	}
	/** 在异步 URL 解析完成后，通知外部最终 imgList 变化 */
	notifyFinalImgListChange(isEdited) {
		if (!isEdited || this._slotElements.length === 0) return;
		this.onImgListChange?.([...this._imgList]);
		this.updatePlaceholderImgList(this._imgList);
	}
	/** 懒加载失败后的回调：在非更新期间立即剔除失败槽位 */
	onLazyLoadFailed() {
		if (!this.isUpdatingImgList) this.removeFailedSlots();
	}
	/** 从当前展示列表中移除多次触发懒加载仍失败的槽位 */
	removeFailedSlots() {
		if (this._slotElements.length === 0) return;
		const keptSlotElements = [];
		const keptImgList = [];
		for (let i = 0; i < this._slotElements.length; i++) {
			const slot = this._slotElements[i];
			if (isLazyLoadFailed(slot)) continue;
			keptSlotElements.push(slot);
			keptImgList.push(this._imgList[i]);
		}
		if (keptSlotElements.length === this._slotElements.length) return;
		this._slotElements = keptSlotElements;
		this._imgList = keptImgList;
		if (this._slotElements.length === 0) return this.onEmpty?.();
		this.onImgListChange?.([...this._imgList]);
		this.updatePlaceholderImgList(this._imgList);
	}
	/** 合格图片集合为空时，清空当前列表状态并通知外部 */
	clearListState() {
		this.updateSeq++;
		this.isUpdatingImgList = false;
		if (this._slotElements.length === 0 && this._imgList.length === 0) return;
		this._slotElements = [];
		this._imgList = [];
		this.onImgListChange?.([]);
	}
	/** 停止扫描时清理资源 */
	clear() {
		this.updateSeq++;
		this.isUpdatingImgList = false;
		this.blobUrlResolver.clear();
		this.placeholderImgList.clear();
		this._slotElements = [];
		this._imgList = [];
	}
};
//#endregion
//#region src/userscript/autoImageScanner/lazyLoadController.ts
var LazyLoadController = class {
	getImgSelector;
	getImageSlotGroups;
	getAllImg;
	runCondition;
	onLazyLoadFailed;
	/** 懒加载触发 promise，用于避免重复触发 */
	triggerPromise;
	constructor(options) {
		this.getImgSelector = options.getImgSelector;
		this.getImageSlotGroups = options.getImageSlotGroups;
		this.getAllImg = options.getAllImg;
		this.runCondition = options.runCondition;
		this.onLazyLoadFailed = options.onLazyLoadFailed;
		lazyLoadTrigger.onFailed = () => this.onLazyLoadFailed?.();
		lazyLoadTrigger.runCondition = this.runCondition;
	}
	/** 手动触发一轮完整的懒加载 */
	trigger() {
		if (this.triggerPromise) return this.triggerPromise;
		this.triggerPromise = (async () => {
			try {
				if (this.getImgSelector()) {
					await this.triggerExpectImg(3);
					await this.triggerExpectImg();
				}
				await this.triggerAllRemainingLazyLoad();
			} finally {
				this.triggerPromise = void 0;
			}
		})();
		return this.triggerPromise;
	}
	/** 停止时清理触发状态 */
	clear() {
		this.triggerPromise = void 0;
	}
	/** 触发大概率是漫画图片且还未成功触发懒加载的元素的懒加载 */
	triggerExpectImg = async (num) => {
		const selector = this.getImgSelector();
		if (!selector) return;
		let expectImgList = helper.querySelectorAll(selector).filter(needTrigger);
		if (num) expectImgList = expectImgList.slice(0, num);
		await triggerLazyLoad(expectImgList);
	};
	/** 触发所有未收敛的 img 和图片容器 */
	triggerAllRemainingLazyLoad = async () => {
		if (!this.runCondition()) return;
		const imgTargets = this.getAllImg().filter(needTrigger);
		if (imgTargets.length > 0) await triggerLazyLoad(imgTargets);
		const groupTargets = [];
		for (const group of this.getImageSlotGroups()) for (const slot of group.slots) if (!helper.isImageElement(slot) && needTrigger(slot)) groupTargets.push(slot);
		if (groupTargets.length > 0) await triggerLazyLoad(groupTargets);
	};
};
//#endregion
//#region src/userscript/autoImageScanner/ImageWatcher.ts
/** 遍历节点及其子树中的所有图片元素 */
const forEachImage = (nodes, callback) => {
	for (const node of nodes) if (helper.isImageElement(node)) callback(node);
	else if (helper.isHTMLElement(node)) for (const img of node.querySelectorAll("img")) callback(img);
};
/** 监听网页上的所有图片元素的变化，筛选出符合条件的图片 */
var ImageWatcher = class {
	options;
	ro;
	mo;
	qualifiedMap = new helper.ReactiveMap();
	targetAttributes = [
		"src",
		"srcset",
		"data-src",
		"data-original",
		"data-srcset"
	];
	constructor(options) {
		this.options = options;
		this.ro = new ResizeObserver(this.handleResize);
		this.mo = new MutationObserver(this.handleMutation);
	}
	start() {
		let changed = false;
		for (const e of document.querySelectorAll("img")) {
			this.observeImage(e);
			if (this.tryQualify(e)) changed = true;
		}
		if (changed) this.options.onChanged(this.qualifiedMap);
		this.mo.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: this.targetAttributes
		});
	}
	/** 停止监听并清理资源 */
	stop() {
		this.mo.disconnect();
		this.ro.disconnect();
		this.qualifiedMap.clear();
	}
	/** 使用 ResizeObserver 监测图片尺寸变化，并在图片加载完成后重新检查 */
	observeImage = (img) => {
		this.ro.observe(img);
		if (img.complete) return;
		img.addEventListener("load", () => {
			if (this.tryQualify(img)) this.options.onChanged(this.qualifiedMap);
		}, { once: true });
	};
	/** 构造图片尺寸信息 */
	createImageInfo(img, display) {
		return {
			display,
			natural: {
				width: img.naturalWidth,
				height: img.naturalHeight
			}
		};
	}
	/** 尝试将图片加入 qualifiedMap，成功返回 true */
	tryQualify(img, display) {
		if (this.qualifiedMap.has(img)) return false;
		const rect = display ?? img.getBoundingClientRect();
		const imageInfo = this.createImageInfo(img, rect);
		if (!this.options.filterImg(imageInfo, img)) return false;
		this.qualifiedMap.set(img, imageInfo);
		this.ro.unobserve(img);
		return true;
	}
	/** 处理 ResizeObserver 的回调，只有在图片尺寸发生实际变化（或初始化）时才会触发 */
	handleResize = (entries) => {
		let changed = false;
		for (const entry of entries) {
			const img = entry.target;
			if (this.tryQualify(img, {
				width: entry.contentRect.width,
				height: entry.contentRect.height
			})) changed = true;
		}
		if (changed) this.options.onChanged(this.qualifiedMap);
	};
	/** 将图片从 qualifiedMap 移除，返回是否真的移除了 */
	deleteImg = (img) => {
		if (!this.qualifiedMap.has(img)) return false;
		this.qualifiedMap.delete(img);
		return true;
	};
	/** 处理新增节点中的图片 */
	handleAddedNodes(nodes) {
		let changed = false;
		forEachImage(nodes, (img) => {
			this.observeImage(img);
			if (this.tryQualify(img)) changed = true;
		});
		return changed;
	}
	/** 处理移除节点中的图片 */
	handleRemovedNodes(nodes) {
		let changed = false;
		forEachImage(nodes, (img) => {
			if (this.deleteImg(img)) changed = true;
		});
		return changed;
	}
	/** 处理图片属性变化 */
	handleAttributeMutation(node) {
		if (!helper.isImageElement(node)) return false;
		if (this.tryQualify(node)) return true;
		let changed = false;
		if (this.deleteImg(node)) changed = true;
		this.observeImage(node);
		return changed;
	}
	/** 处理监听节点的增删改 */
	handleMutation = (mutations) => {
		let changed = false;
		for (const mutation of mutations) switch (mutation.type) {
			case "childList":
				changed = this.handleAddedNodes(mutation.addedNodes) || changed;
				changed = this.handleRemovedNodes(mutation.removedNodes) || changed;
				break;
			case "attributes": changed = this.handleAttributeMutation(mutation.target) || changed;
		}
		if (changed) this.options.onChanged(this.qualifiedMap);
	};
};
//#endregion
//#region src/userscript/autoImageScanner/qualifiedImageWatcher.ts
const IMG_BLACK_LIST_SELECTOR = ["#pagetual-preload", "noscript"].join(",");
/** 监听并获取网页上所有符合条件的图片元素 */
var QualifiedImageWatcher = class {
	getImgSelector;
	filterImg;
	imageWatcher;
	constructor(options) {
		this.getImgSelector = options.getImgSelector;
		this.filterImg = options.filterImg;
		this.imageWatcher = new ImageWatcher({
			filterImg: (info, img) => this.filterImage(info, img),
			onChanged: options.onChanged
		});
	}
	/** 开始监听网页图片 */
	start() {
		this.imageWatcher.start();
	}
	/** 停止监听并清理资源 */
	stop() {
		this.imageWatcher.stop();
	}
	/** 获取页面上所有不在黑名单中的图片元素 */
	getAllImg() {
		return helper.querySelectorAll(\`:not(\${IMG_BLACK_LIST_SELECTOR}) > img\`);
	}
	/** 判断图片是否符合扫描条件 */
	filterImage = (info, img) => {
		if (img.closest(IMG_BLACK_LIST_SELECTOR)) return false;
		const imgSelector = this.getImgSelector();
		if (imgSelector && isEleSelector(img, imgSelector)) return true;
		if (this.filterImg) return this.filterImg(info, img);
		if (info.display.height <= 100 || info.display.width <= 100) return false;
		return info.natural.height > 500 && info.natural.width > 500;
	};
};
//#endregion
//#region src/userscript/autoImageScanner/index.ts
const SELECTOR_FALLBACK_TIMEOUT = 3e3;
/** 自动发现网页上的所有漫画图片的通用扫描器 */
var AutoImageScanner = class {
	/** 能获取到所有图片的 selector */
	initSelector;
	/** 是否要按图片在页面中的垂直位置排序，否则将按文档顺序排序 */
	enableSortImageByTop;
	/** 是否只保留图片槽位组内的图片 */
	filterByContainer;
	/** 自定义图片过滤规则 */
	filterImg;
	/** 是否触发懒加载的条件 */
	shouldTriggerLazyLoad;
	/** 图片列表变化时的回调 */
	onImgListChange;
	/** 章节切换按钮变化时的回调 */
	onChapterSwitchChange;
	/** 页面上没有符合条件的图片时的回调 */
	onEmpty;
	/** 发现新的正确的能获取到所有图片的 selector 时的回调 */
	onSelectorSuggest;
	/** 是否已开始监听 */
	started = false;
	/** 当前生效的图片 selector */
	imgSelector;
	/** 显式 selector 回退定时器 */
	selectorFallbackTimer;
	/** 代际标记，用于忽略 stop 后过期的 handleChanged 回调 */
	generation = 0;
	imageWatcher;
	imageListBuilder;
	lazyLoadController;
	/** 所有「相似、成组」的图片槽位组 */
	imageSlotGroups = [];
	/** 当前识别到的章节切换按钮 */
	chapterSwitch = {};
	/**
	* @param options 扫描器配置
	*/
	constructor(options) {
		this.initSelector = options.selector;
		this.filterImg = options.filterImg;
		this.onImgListChange = options.onImgListChange;
		this.onEmpty = options.onEmpty;
		this.onChapterSwitchChange = options.onChapterSwitchChange;
		this.onSelectorSuggest = options.onSelectorSuggest;
		this.shouldTriggerLazyLoad = options.shouldTriggerLazyLoad;
		this.imgSelector = options.selector ?? "";
		this.enableSortImageByTop = options.sortImageByTop ?? false;
		this.filterByContainer = options.filterByContainer ?? true;
		this.imageWatcher = new QualifiedImageWatcher({
			getImgSelector: () => this.imgSelector,
			filterImg: this.filterImg,
			onChanged: (map) => this.handleChanged(map, this.generation)
		});
		this.imageListBuilder = new ImageListBuilder({
			enableSortImageByTop: this.enableSortImageByTop,
			filterByContainer: this.filterByContainer,
			onImgListChange: (imgList) => this.onImgListChange?.(imgList),
			onEmpty: () => this.onEmpty?.()
		});
		this.lazyLoadController = new LazyLoadController({
			getImgSelector: () => this.imgSelector,
			getImageSlotGroups: () => this.imageSlotGroups,
			getAllImg: () => this.imageWatcher.getAllImg(),
			runCondition: () => this.shouldTriggerLazyLoad?.() ?? true,
			onLazyLoadFailed: () => this.imageListBuilder.onLazyLoadFailed()
		});
	}
	/** 最终选中的图片 url */
	get imgList() {
		return this.imageListBuilder.imgList;
	}
	/** 最终选中的图片槽位 */
	get slotElements() {
		return this.imageListBuilder.slotElements;
	}
	/** 开始寻找页面图片 */
	start() {
		if (this.started) return;
		this.started = true;
		this.imageWatcher.start();
		if (this.initSelector && this.imgSelector === this.initSelector) this.selectorFallbackTimer = window.setTimeout(() => {
			if (helper.querySelectorAll(this.imgSelector).length > 0) return;
			this.imgSelector = "";
			this.lazyLoadController.trigger();
		}, SELECTOR_FALLBACK_TIMEOUT);
	}
	/** 停止监听并清理资源 */
	stop() {
		this.started = false;
		this.generation++;
		this.handleChanged.clear();
		this.imageWatcher.stop();
		this.imageListBuilder.clear();
		if (this.selectorFallbackTimer !== void 0) window.clearTimeout(this.selectorFallbackTimer);
		this.selectorFallbackTimer = void 0;
		this.lazyLoadController.clear();
		this.imageSlotGroups = [];
		this.chapterSwitch = {};
	}
	/** 等到发现首张图片 */
	async waitFirstImage(timeout = 1e4) {
		const list = await helper.wait(() => this.imgList.some(Boolean) ? [...this.imgList] : void 0, timeout);
		if (!list?.length) throw new Error(helper.t("site.changed_load_failed"));
		return list;
	}
	/** 手动触发一轮懒加载 */
	triggerLazyLoad() {
		this.start();
		return this.lazyLoadController.trigger();
	}
	/** 记录传入的图片元素中最常见的那个 selector（仅 initSelector 失效时） */
	saveImgEleSelector = (list) => {
		if (list.length < 7 || this.initSelector && this.imgSelector === this.initSelector) return;
		const newSelector = helper.getMostItem(list.map(getEleSelector));
		if (newSelector !== this.imgSelector) {
			this.imgSelector = newSelector;
			this.onSelectorSuggest?.(newSelector);
		}
	};
	/** 图片集合变化时更新图片列表、章节按钮并触发懒加载 */
	handleChanged = helper.throttle(async (map, generation) => {
		if (generation !== this.generation) return;
		if (map.size === 0) {
			this.imageSlotGroups = [];
			this.imageListBuilder.clearListState();
			return this.onEmpty?.();
		}
		const { groups, bestGroup } = getImageSlotGroupResult(map);
		this.imageSlotGroups = groups;
		const imgEleList = [...map.keys()];
		const { isEdited, isEmpty } = await this.imageListBuilder.update(map, bestGroup, generation);
		if (generation !== this.generation) return;
		if (isEmpty) return;
		if (isEdited) this.saveImgEleSelector(imgEleList);
		this.lazyLoadController.trigger();
		this.chapterSwitch = getChapterSwitch();
		await this.onChapterSwitchChange?.({ ...this.chapterSwitch });
		if (generation !== this.generation) return;
		this.imageListBuilder.notifyFinalImgListChange(isEdited);
	}, 500);
};
//#endregion
exports.AutoImageScanner = AutoImageScanner;
`,
	"userscript/supportWorker": `\n//#region src/userscript/supportWorker.ts
let supportWorker;
console.debug(supportWorker);
new Promise((resolve) => {
	if (typeof Worker === "undefined") return resolve(false);
	let worker;
	let url;
	const finish = (value) => {
		worker?.terminate();
		if (url) URL.revokeObjectURL(url);
		resolve(value);
	};
	try {
		url = URL.createObjectURL(new Blob(["onmessage=e=>postMessage(e.data)"], { type: "text/javascript" }));
		worker = new Worker(url);
		worker.onmessage = () => finish(true);
		worker.onerror = () => finish(false);
		worker.postMessage("ping");
		setTimeout(() => finish(false), 3e3);
	} catch {
		finish(false);
	}
}).then((val) => supportWorker = val);
//#endregion
Object.defineProperty(exports, "supportWorker", {
	enumerable: true,
	get: function() {
		return supportWorker;
	}
});
`,
	"userscript/multiSelect": `\nlet solid_js_web = require("solid-js/web");
let helper = require("helper");
let solid_js = require("solid-js");
let core = require("core");
//#region src/userscript/multiSelect/SelectionMask.tsx
var _tmpl$$1 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"width=1.5em height=1.5em fill=none opacity=0.4 style=display:inline;vertical-align:-0.15em><rect x=2 y=2 width=20 height=20 rx=5 stroke=currentColor stroke-width=1.3 stroke-dasharray="3 2">\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<div class=selection-mask><span class=selection-mask-order>\`);
const DashedRoundedSquare = () => _tmpl$$1();
const SelectionMask = (props) => {
	const id = () => props.registeredItems().get(props.dom);
	const isSelected = () => props.selection.isSelected(id());
	helper.css\`
    \${props.dom}
    .selection-mask {
      touch-action: none;
      cursor: pointer;
      cursor: cell;
      user-select: none;

      position: absolute;
      z-index: 2147483646;
      top: 0;
      left: 0;

      container-type: size;
      overflow: clip;
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      font-size: 4cqmin;

      background: rgb(0 0 0 / 60%);
    }

    .selection-mask-order {
      font-family: sans-serif;
      font-size: 2em;
      font-weight: bold;
      text-shadow: none;

      -webkit-text-stroke: 0;
    }
  \`;
	helper.css(".selection-mask", { color: () => isSelected() ? "#ffffffbf" : "#fffb" }, props.dom);
	return solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return props.isEnabled();
		},
		get children() {
			var _el$2 = _tmpl$2(), _el$3 = _el$2.firstChild;
			solid_js_web.addEventListener(_el$2, "click", helper.withEventStop(), true);
			solid_js_web.addEventListener(_el$2, "contextmenu", helper.withEventStop(), true);
			solid_js_web.addEventListener(_el$2, "mouseover", helper.withEventStop(), true);
			solid_js_web.addEventListener(_el$2, "pointerover", helper.withEventStop(), true);
			solid_js_web.addEventListener(_el$2, "pointerenter", helper.withEventStop((e) => props.drag.onPointerEnter(props.dom, e)));
			solid_js_web.addEventListener(_el$2, "pointerdown", helper.withEventStop((e) => props.drag.onPointerDown(props.dom, e)), true);
			solid_js_web.insert(_el$3, () => props.selection.getOrder(id()) ?? solid_js_web.createComponent(DashedRoundedSquare, {}));
			return _el$2;
		}
	});
};
solid_js_web.delegateEvents([
	"pointerdown",
	"pointerover",
	"mouseover",
	"contextmenu",
	"click"
]);
//#endregion
//#region src/userscript/multiSelect/useDragSelect.ts
const useDragSelect = ({ isEnabled, registeredItems, isSelected, setSession, session, commit, cancel }) => {
	/** 当前活跃手势的 pointerId，null 表示无活跃手势 */
	let pointerId = null;
	/** 锚点在 items 中的索引，固定不变 */
	let anchorIndex = -1;
	/** 当前手势是否扩展过范围（用于判断是否应撤销选择） */
	let hasExpanded = false;
	return {
		onPointerDown: (dom, e) => {
			if (!isEnabled() || !e.isPrimary) return;
			if (e.pointerType === "mouse" && e.button !== 0) return;
			const entries = [...registeredItems().entries()];
			anchorIndex = entries.findIndex(([d]) => d === dom);
			if (anchorIndex === -1) return;
			({pointerId} = e);
			hasExpanded = false;
			setSession((state) => {
				state.operationType = isSelected(registeredItems().get(dom)) ? "unselect" : "select";
				state.items = entries.map(([, id]) => id);
				state.range = [anchorIndex, anchorIndex];
			});
		},
		onPointerEnter: (dom, e) => {
			if (!isEnabled() || pointerId === null || e.pointerId !== pointerId) return;
			if (e.pointerType === "mouse" && (e.buttons & 1) === 0) {
				pointerId = null;
				return cancel();
			}
			const currentIndex = [...registeredItems().keys()].indexOf(dom);
			if (currentIndex === -1) return;
			const newRange = anchorIndex <= currentIndex ? [anchorIndex, currentIndex] : [currentIndex, anchorIndex];
			setSession((state) => {
				if (state.range[0] === newRange[0] && state.range[1] === newRange[1]) return;
				state.range = newRange;
				if (newRange[0] !== newRange[1]) hasExpanded = true;
			});
		},
		onPointerUp: (e) => {
			if (e.pointerId !== pointerId) return;
			pointerId = null;
			if (session.range[0] === session.range[1] && hasExpanded) cancel();
			else commit();
		},
		onPointerCancel: (e) => {
			if (e.pointerId !== pointerId) return;
			pointerId = null;
			cancel();
		},
		/** 取消活跃手势并重置状态 */
		clear: () => {
			if (pointerId !== null) cancel();
			pointerId = null;
		}
	};
};
//#endregion
//#region src/userscript/multiSelect/useSelection.ts
/** 创建选中状态管理器 */
const createSelectionController = () => {
	/** 已确认的选中项 */
	const baselineIds = new helper.ReactiveSet();
	const { store: session, setState: setSession } = helper.useStore({
		items: [],
		range: [-1, -1],
		operationType: "select"
	});
	/** 判断 session 是否处于活跃状态 */
	const isSessionActive = () => session.range[0] >= 0 && session.range[1] >= 0;
	/** 当前 range 区间内的 id 集合 */
	const rangeIds = helper.createRootMemo(() => {
		if (!isSessionActive()) return /* @__PURE__ */ new Set();
		return new Set(session.items.slice(session.range[0], session.range[1] + 1));
	});
	const selectedIds = helper.createRootMemo(() => {
		if (!isSessionActive()) return [...baselineIds];
		return session.operationType === "select" ? [...baselineIds.union(rangeIds())] : [...baselineIds.difference(rangeIds())];
	});
	/** 记录每个 id 的选中顺序 */
	const orderMap = helper.createRootMemo(() => Object.fromEntries(selectedIds().map((id, i) => [id, i + 1])));
	const cancel = () => setSession((state) => {
		state.items = [];
		state.range = [-1, -1];
		state.operationType = "select";
	});
	return {
		/** 当前会话状态（只读） */
		session,
		/** 当前选中项 id 列表 */
		selectedIds,
		/** 记录每个 id 的选中顺序 */
		orderMap,
		/** 判断指定 id 是否被选中 */
		isSelected: (id) => id in orderMap(),
		/** 获取指定 id 的选中顺序，未选中返回 undefined */
		getOrder: (id) => orderMap()[id],
		/** 修改会话状态 */
		setSession,
		/** 将 session 的修改应用到基线，然后重置 session */
		commit: () => {
			if (!isSessionActive()) return;
			if (session.operationType === "select") for (const id of rangeIds()) baselineIds.add(id);
			else for (const id of rangeIds()) baselineIds.delete(id);
			cancel();
		},
		/** 重置 session 为初始状态 */
		cancel,
		/** 直接设置基线选中项列表 */
		setBaseline: (ids) => {
			baselineIds.clear();
			for (const id of ids) baselineIds.add(id);
		},
		/** 清空基线选中项列表 */
		clearBaseline: () => baselineIds.clear()
	};
};
//#endregion
//#region src/userscript/multiSelect/useMultiSelect.tsx
const useMultiSelect = ({ onStart, registeredItems }) => solid_js.createRoot((dispose) => {
	const [isEnabled, setIsEnabled] = solid_js.createSignal(false);
	const selectionController = createSelectionController();
	const drag = useDragSelect({
		isEnabled,
		registeredItems,
		...selectionController
	});
	/** 所有需要在 unmount 时执行的清理函数（DOM dispose、事件监听等） */
	const cleanups = [];
	let isInitialized = false;
	let elementIndex = 0;
	/** 注册一个可选元素：挂载 SelectionMask */
	const register = (dom) => {
		if (!registeredItems().get(dom)) return;
		const index = elementIndex++;
		const container = document.createElement("div");
		dom.append(container);
		const disposeDom = solid_js_web.render(() => solid_js_web.createComponent(SelectionMask, {
			dom,
			index,
			isEnabled,
			registeredItems,
			selection: selectionController,
			drag
		}), container);
		cleanups.push(() => {
			disposeDom();
			container.remove();
		});
	};
	/** 卸载所有 DOM 注册和事件监听，但保留选中状态（翻页场景） */
	const unmount = () => {
		drag.clear();
		setIsEnabled(false);
		isInitialized = false;
		for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]?.();
		cleanups.length = 0;
	};
	return {
		/** 当前是否处于多选模式 */
		isEnabled,
		/** 开启多选模式并注册元素 */
		start: () => {
			if (isEnabled()) return;
			setIsEnabled(true);
			if (isInitialized) return;
			document.addEventListener("pointerup", drag.onPointerUp);
			document.addEventListener("pointercancel", drag.onPointerCancel);
			cleanups.push(() => {
				document.removeEventListener("pointerup", drag.onPointerUp);
				document.removeEventListener("pointercancel", drag.onPointerCancel);
			});
			const cleanup = onStart?.();
			if (cleanup) cleanups.push(cleanup);
			for (const dom of registeredItems().keys()) register(dom);
			isInitialized = true;
		},
		/** 结束多选模式，并发处理所有选中项并返回结果列表 */
		collect: async (process, limit) => {
			const ids = selectionController.selectedIds();
			if (ids.length === 0) return [];
			setIsEnabled(false);
			return await helper.plimit(ids.map((id) => async () => {
				try {
					return await process(id);
				} catch (error) {
					return error instanceof Error ? error : new Error(String(error));
				}
			}), void 0, limit);
		},
		/** 清空选中状态并卸载所有 DOM 注册 */
		clear: () => {
			selectionController.clearBaseline();
			selectionController.cancel();
			unmount();
		},
		unmount,
		/** 清理所有 SolidJS 响应式资源 */
		dispose,
		/** 当前选中项 ID 列表 */
		selectedIds: selectionController.selectedIds,
		/** 根据 ID 列表恢复选中状态（翻页后重新注册 DOM 时使用） */
		setSelectedIds: selectionController.setBaseline
	};
});
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/checklist.svg
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M22 8c0-.55-.45-1-1-1h-7c-.55 0-1 .45-1 1s.45 1 1 1h7c.55 0 1-.45 1-1m-9 8c0 .55.45 1 1 1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7c-.55 0-1 .45-1 1M10.47 4.63c.39.39.39 1.02 0 1.41l-4.23 4.25c-.39.39-1.02.39-1.42 0L2.7 8.16a.996.996 0 1 1 1.41-1.41l1.42 1.42 3.54-3.54c.38-.38 1.02-.38 1.4 0m.01 8.01c.39.39.39 1.02 0 1.41L6.25 18.3c-.39.39-1.02.39-1.42 0L2.7 16.16a.996.996 0 1 1 1.41-1.41l1.42 1.42 3.54-3.54c.38-.38 1.02-.38 1.41.01">\`);
var checklist_default = (props = {}) => (() => {
	var _el$ = _tmpl$();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/userscript/multiSelect/useMultiSelectLoad.tsx
const createMultiSelectLoadController = (coreCtx, { id: initListId, onStart, allItemIds, getImgList }) => solid_js.createRoot(async (rootDispose) => {
	const { setState, showComic } = coreCtx;
	const cache = await helper.useCache({
		pending: "id",
		confirmed: "id"
	}, "MultiSelect");
	const [listId, setListId] = solid_js.createSignal(initListId);
	const [registeredItems, setRegisteredItems] = solid_js.createSignal(/* @__PURE__ */ new Map());
	const controller = useMultiSelect({
		onStart,
		registeredItems
	});
	helper.createEffectOn([listId], ([currentId], prev) => {
		const prevId = prev?.[0];
		if (prevId !== void 0 && prevId !== currentId) controller.clear();
	});
	const urlMap = {};
	const targetIds = helper.createRootMemo(() => {
		const ids = controller.selectedIds();
		if (controller.isEnabled() && ids.length > 0) return ids;
		return allItemIds?.() ?? [];
	});
	const computeImgList = () => targetIds().flatMap((id) => urlMap[id] ?? [""]);
	/** 将 Manga 组件的扁平图片索引转为对应的选中项 ID */
	const getItemIdsFromIndices = (indices) => {
		const ids = [];
		let offset = 0;
		for (const id of targetIds()) {
			const len = urlMap[id]?.length ?? 1;
			for (const idx of indices) if (helper.inRange(offset, idx, offset + len - 1)) {
				ids.push(id);
				break;
			}
			offset += len;
		}
		return ids;
	};
	const reSetStore = () => {
		setState("comicMap", "", { getImgList: Object.assign(async () => {
			if (coreCtx.store.comicMap[""].imgList?.length) return coreCtx.store.comicMap[""].imgList;
			await new Promise((resolve) => {
				const queue = new helper.PQueue(async (id) => {
					try {
						urlMap[id] = await getImgList(id);
					} catch (error) {
						console.error(error);
					}
					setState("comicMap", "", "imgList", computeImgList());
					resolve();
				}, 4);
				setState((state) => {
					state.comicMap[""].imgList = computeImgList();
					state.manga.onWaitUrlImgs = (imgs) => {
						queue.set(...getItemIdsFromIndices(imgs));
					};
				});
				if (targetIds().some((id) => urlMap[id])) resolve();
			});
			return coreCtx.store.comicMap[""].imgList;
		}, allItemIds ? {} : { type: "multiSelect" }) });
	};
	reSetStore();
	const multiSelectLoad = helper.singleThreaded(async () => {
		if (!controller.isEnabled()) {
			controller.start();
			const confirmed = await cache.get("confirmed", listId());
			if (confirmed) controller.setSelectedIds(confirmed.selecteds);
			return;
		}
		await cache.del("pending", listId());
		await cache.set("confirmed", {
			id: listId(),
			selecteds: controller.selectedIds()
		});
		if (controller.selectedIds().length === 0) return;
		setState("comicMap", "", "imgList", void 0);
		await showComic("");
	});
	let unregisterEscHandler;
	helper.createEffectOn([controller.isEnabled], ([enabled]) => {
		if (enabled) {
			unregisterEscHandler?.();
			unregisterEscHandler = core.registerEsc(-1, () => controller.isEnabled() && !coreCtx.store.manga.show ? unmount() : "SKIP");
		}
	});
	setState("fab", "extraSpeedDial", [{
		name: helper.t("hotkeys.multi_select_load"),
		onClick: multiSelectLoad,
		icon: checklist_default
	}]);
	helper.createEffectOn([
		controller.isEnabled,
		() => controller.selectedIds().length,
		listId
	], ([enabled, , id]) => {
		const selecteds = controller.selectedIds();
		(async () => {
			await cache.del("pending", id);
			await (selecteds.length === 0 ? cache.del("confirmed", id) : cache.set(enabled ? "pending" : "confirmed", {
				id,
				selecteds
			}));
		})();
	}, { defer: true });
	core.listenHotkey({
		multi_select_load: multiSelectLoad,
		enter_read_mode: () => controller.isEnabled() || !coreCtx.canLoadComic() ? multiSelectLoad() : coreCtx.showComic()
	}, true);
	let oldIdSet = [];
	/** 清理副作用，但保留选中状态（用于翻页） */
	const unmount = () => {
		setState("comicMap", "", "imgList", void 0);
		unregisterEscHandler?.();
		oldIdSet = [...registeredItems().values()];
		controller.unmount();
	};
	const completeDispose = () => {
		oldIdSet = [];
		unmount();
		controller.dispose();
		setRegisteredItems(/* @__PURE__ */ new Map());
		coreCtx.setMultiSelect(void 0);
		rootDispose();
	};
	return {
		reSetStore,
		/** 注册新的可选项，并等待至和上次的注册项不同 */
		registerItems: async (newId, fillItems, maxWaitTime = 5e3) => {
			setListId(newId);
			const map = await helper.wait(async () => {
				const newMap = /* @__PURE__ */ new Map();
				await fillItems(newMap);
				if (newMap.size === 0) return;
				if (helper.isEqual(oldIdSet, [...newMap.values()])) return;
				return newMap;
			}, maxWaitTime);
			if (!map) throw new Error("等待新 DOM 超时");
			setRegisteredItems(map);
			const pending = await cache.get("pending", listId());
			if (pending?.selecteds.length) {
				controller.start();
				controller.setSelectedIds(pending.selecteds);
			}
		},
		unmount,
		/** 完全清理所有状态和副作用 */
		dispose: completeDispose,
		/** 页面切换时的清理策略 */
		createCleanup: (id) => (nextPageCtx) => {
			unmount();
			if (nextPageCtx?.type !== "list" || nextPageCtx?.id !== id) {
				completeDispose();
				multiSelectLoadController = void 0;
			}
		},
		load: multiSelectLoad,
		isEnabled: controller.isEnabled,
		selectedIds: controller.selectedIds,
		clear: controller.clear,
		setSelectedIds: controller.setSelectedIds
	};
});
let multiSelectLoadController;
const useMultiSelectLoad = async (coreCtx, options) => {
	if (multiSelectLoadController) {
		multiSelectLoadController.reSetStore();
		return multiSelectLoadController;
	}
	multiSelectLoadController = await createMultiSelectLoadController(coreCtx, options);
	coreCtx.setMultiSelect(multiSelectLoadController);
	return multiSelectLoadController;
};
//#endregion
exports.SelectionMask = SelectionMask;
exports.createMultiSelectLoadController = createMultiSelectLoadController;
exports.useMultiSelect = useMultiSelect;
exports.useMultiSelectLoad = useMultiSelectLoad;
`,
	"worker/detectAd": `\n//#region \\0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let jsqr = require("jsqr");
jsqr = __toESM(jsqr, 1);
//#region src/worker/detectAd/workHelper.ts
const mainFn = {};
const setMainFn = (helper, keys) => {
	for (const name of keys) Reflect.set(mainFn, name, (...args) => Reflect.apply(helper[name], helper, args));
};
/** 计算 rgb 的灰度 */
const toGray = (r, g, b) => Math.round(.299 * r + .587 * g + .114 * b);
//#endregion
//#region src/worker/detectAd/index.ts
/** 判断一张图是否是彩图 */
const isColorImg = (data) => {
	for (let i = 0; i < data.length; i += 16) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		if (!(r === g && r === b)) return true;
	}
	return false;
};
/** 二维码白名单 */
const qrCodeWhiteList = [
	/^https:\\/\\/[^.]+\\.fanbox\\.cc/u,
	/^https:\\/\\/twitter\\.com/u,
	/^https:\\/\\/x\\.com/u,
	/^https:\\/\\/fantia\\.jp/u,
	/^https:\\/\\/marshmallow-qa\\.com/u,
	/^https:\\/\\/www\\.dlsite\\.com/u,
	/^https:\\/\\/hitomi\\.la/u
];
const options = { inversionAttempts: "attemptBoth" };
/** 识别图像上的二维码 */
const getQrCode = (img, width, height) => {
	try {
		const binaryData = jsqr.default(img, width, height, options)?.binaryData;
		if (!binaryData) return false;
		const text = new TextDecoder().decode(Uint8Array.from(binaryData));
		mainFn.log(\`检测到二维码： \${text}\`);
		return text;
	} catch (error) {
		mainFn.log(error);
	}
};
const getImgData = (img) => {
	const canvas = new OffscreenCanvas(img.width, img.height);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const scanImgBlock = (img, sx, sy, w, h) => {
	if (w === img.width && h === img.height) return getQrCode(img.data, w, h);
	const data = new Uint8ClampedArray(/* @__PURE__ */ new ArrayBuffer(w * h * 4));
	for (let y = 0, height = sy + h; y < height; y++) for (let x = 0, width = sx + w; x < width; x++) {
		const i = (y * w + x) * 4;
		const target = ((y + sy) * img.width + (x + sx)) * 4;
		data[i] = img.data[target];
		data[i + 1] = img.data[target + 1];
		data[i + 2] = img.data[target + 2];
		data[i + 3] = img.data[target + 3];
	}
	return getQrCode(data, w, h);
};
const isAdImg = (imgBitmap) => {
	const imgData = getImgData(imgBitmap);
	if (!isColorImg(imgData.data)) return false;
	for (let i = 0; i < imgData.data.length; i += 4) {
		const val = toGray(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]) < 200 ? 0 : 255;
		imgData.data[i] = val;
		imgData.data[i + 1] = val;
		imgData.data[i + 2] = val;
		imgData.data[i + 3] = 255;
	}
	let text = getQrCode(imgData.data, imgData.width, imgData.height);
	if (!text) {
		const w = Math.floor(imgData.width / 2);
		const h = Math.floor(imgData.height / 2);
		for (const [sx, sy] of [
			[w, h],
			[0, h],
			[w, 0],
			[0, 0]
		]) {
			text = scanImgBlock(imgData, sx, sy, w, h);
			if (text) break;
		}
	}
	if (text) return qrCodeWhiteList.every((reg) => !reg.test(text));
	return false;
};
//#endregion
exports.isAdImg = isAdImg;
exports.setMainFn = setMainFn;
`,
	"worker/ImageRecognition": `\n/**
* 用途：面积小于该比例的 Region 会被删除。
* 取值范围：0 ~ 1
*/
const MIN_REGION_RATIO = .01;
/**
* 用途：边缘起点区域占图片长/宽的比例。
* 取值范围：0 ~ 0.5
*/
const EDGE_SEED_RATIO = .05;
/**
* 用途：背景色判断时，边缘区域宽度占图片较短边的比例。
* 取值范围：0 ~ 0.5
*/
const EDGE_AREA_RATIO = .07;
/**
* 用途：空白边缘扫描时，与参考背景色之间允许的最大 Oklab 色差。
* 单位：Oklab 空间中的欧氏距离（ΔE），不是百分比。
* 取值范围：0 ~ 1.51
*/
const BLANK_MARGIN_COLOR_TOLERANCE = .2;
/**
* 用途：整边累计允许的超色差像素数，占该边长度（左右边=图片高度，上下边=图片宽度）的比例。
* 单位：比例值，0.01 表示 1%。
* 取值范围：0 ~ 1
*/
const BLANK_MARGIN_MAX_OUTLIER_RATIO = .005;
/**
* 用途：桶内分组允许的最大综合距离，也用于相邻色相桶边界组的合并判断。
* 取值范围：0 ~ 1
*/
const HSV_GROUP_THRESHOLD = .12;
/**
* 用途：HSV 综合距离中饱和度差 ΔS 的权重。
* 取值范围：>= 0
*/
const SATURATION_WEIGHT = .6;
//#endregion
//#region src/worker/ImageRecognition/workHelper.ts
const mainFn = {};
const setMainFn = (helper, keys) => {
	for (const name of keys) {
		const fn = helper[name];
		if (!fn) continue;
		Reflect.set(mainFn, name, (...args) => Reflect.apply(fn, helper, args));
	}
};
//#endregion
//#region src/worker/ImageRecognition/background.ts
const isInEdgeArea = (index, { width, height, edgeX, edgeY }) => {
	const x = index % width;
	const y = Math.floor(index / width);
	return x < edgeX || x >= width - edgeX || y < edgeY || y >= height - edgeY;
};
/**
* 判断图像的背景色。
*
* 在图片边缘区域内找到占比最大的背景区域，
* 如果该区域在边缘区域中的占比达到 EDGE_AREA_REGION_RATIO，
* 则将该区域的主色视为背景色，否则判定取色失败。
*/
const getBackgroundColor = (img) => {
	const manager = img.backgroundRegions;
	if (manager.getRegionCount() === 0) return null;
	const { width, height } = img;
	const edge = Math.max(1, Math.floor(Math.min(width, height) * EDGE_AREA_RATIO));
	const edgeArea = {
		width,
		height,
		edgeX: edge,
		edgeY: edge
	};
	const centerWidth = Math.max(0, width - edge * 2);
	const centerHeight = Math.max(0, height - edge * 2);
	const totalEdgeAreaPixels = width * height - centerWidth * centerHeight;
	let maxRegionId;
	let maxCount = 0;
	for (const id of manager.getRegionIds()) {
		let count = 0;
		manager.forEachPixelOfRegion(id, (index) => {
			if (isInEdgeArea(index, edgeArea)) count += 1;
		});
		if (count > maxCount) {
			maxCount = count;
			maxRegionId = id;
		}
	}
	img.logger.mark("背景色区域统计完成");
	if (maxRegionId === void 0 || maxCount / totalEdgeAreaPixels < .15) return null;
	const color = manager.getRegion(maxRegionId)?.getMainColor() ?? null;
	img.logger.mark("背景主色提取完成", color ?? "未检测到");
	return color;
};
/** 获取图片背景色并写入 ImgContext */
const getBackground = (img) => img.background ??= getBackgroundColor(img);
//#endregion
//#region src/worker/ImageRecognition/colorUtils/ColorHistogram.ts
/** 统计整数 key 的直方图，求出众数 key */
var ColorHistogram = class {
	counts = /* @__PURE__ */ new Map();
	modeKey = 0;
	modeCount = 0;
	add(key) {
		const count = (this.counts.get(key) ?? 0) + 1;
		this.counts.set(key, count);
		if (count > this.modeCount) {
			this.modeCount = count;
			this.modeKey = key;
		}
	}
	merge(other) {
		for (const [key, count] of other.counts) {
			const mergedCount = (this.counts.get(key) ?? 0) + count;
			this.counts.set(key, mergedCount);
			if (mergedCount > this.modeCount) {
				this.modeCount = mergedCount;
				this.modeKey = key;
			}
		}
	}
	getModeKey() {
		if (this.modeCount !== 0) return this.modeKey;
	}
};
//#endregion
//#region src/worker/ImageRecognition/colorUtils/hsv.ts
/** 将 0~255 或 0~1 的 RGB 分量统一到 0~1。 */
const normalizeChannel = (value) => {
	const clamped = Math.max(0, Math.min(255, value));
	return clamped > 1 ? clamped / 255 : clamped;
};
const rgbToHsv = (color) => {
	const r = normalizeChannel(color.r);
	const g = normalizeChannel(color.g);
	const b = normalizeChannel(color.b);
	const max = Math.max(r, g, b);
	const delta = max - Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const v = max;
	if (max !== 0) s = delta / max;
	if (delta !== 0) {
		if (max === r) h = 60 * ((g - b) / delta % 6);
		else if (max === g) h = 60 * ((b - r) / delta + 2);
		else h = 60 * ((r - g) / delta + 4);
		if (h < 0) h += 360;
		if (h >= 360) h -= 360;
	}
	return {
		h,
		s,
		v
	};
};
/** HSV 色差距离 */
const hsvDistanceSquared = (a, b, saturationWeight = SATURATION_WEIGHT) => {
	const dv = a.v - b.v;
	const ds = a.s - b.s;
	return dv * dv + saturationWeight * saturationWeight * ds * ds;
};
//#endregion
//#region src/worker/ImageRecognition/colorUtils/grouping.ts
const H_BUCKET_WIDTH = 15;
const HSV_GROUP_THRESHOLD_SQUARED = HSV_GROUP_THRESHOLD ** 2;
/** 计算一组分组数组的平均 HSV */
const averageHsvOfGroups = (groupArrays, hsvColors) => {
	const sum = {
		h: 0,
		s: 0,
		v: 0
	};
	let count = 0;
	for (const group of groupArrays) for (const index of group) {
		sum.h += hsvColors[index].h;
		sum.s += hsvColors[index].s;
		sum.v += hsvColors[index].v;
		count += 1;
	}
	if (count === 0) return {
		h: 0,
		s: 0,
		v: 0
	};
	return {
		h: sum.h / count,
		s: sum.s / count,
		v: sum.v / count
	};
};
/**
* 无彩桶：按 V 从小到大排序，贪心分段。
* 因为只比较亮度，排序后区间最大亮度差就是首尾亮度差。
*/
const groupAchromatic = (indices, hsvColors) => {
	if (indices.length === 0) return [];
	const ordered = indices.toSorted((a, b) => hsvColors[a].v - hsvColors[b].v);
	const groups = [];
	let start = 0;
	for (let end = 1; end <= ordered.length; end++) if (end === ordered.length || hsvColors[ordered[end]].v - hsvColors[ordered[start]].v > .12) {
		groups.push(ordered.slice(start, end));
		start = end;
	}
	return groups;
};
/**
* 彩色桶：桶内 H 已相近，按 V 从小到大排序后贪心分组。
* 每次扩展新点时检查它与当前组内所有点的综合距离。
*/
const groupChromatic = (indices, hsvColors) => {
	if (indices.length === 0) return [];
	const ordered = indices.toSorted((a, b) => hsvColors[a].v - hsvColors[b].v);
	const groups = [];
	let current = [ordered[0]];
	for (let i = 1; i < ordered.length; i++) {
		const index = ordered[i];
		let maxDistSquared = 0;
		for (const existing of current) maxDistSquared = Math.max(maxDistSquared, hsvDistanceSquared(hsvColors[index], hsvColors[existing]));
		if (maxDistSquared <= HSV_GROUP_THRESHOLD_SQUARED) current.push(index);
		else {
			groups.push(current);
			current = [index];
		}
	}
	groups.push(current);
	return groups;
};
/** 对代表色执行 HSV 分桶分组 */
const groupColorsByHsv = (colors) => {
	if (colors.length === 0) return [];
	const hsvColors = colors.map(rgbToHsv);
	const grayIndices = [];
	const buckets = Array.from({ length: 24 }, () => []);
	for (let i = 0; i < hsvColors.length; i++) {
		const { h, s } = hsvColors[i];
		if (s < .03) grayIndices.push(i);
		else buckets[Math.min(23, Math.floor(h / H_BUCKET_WIDTH))].push(i);
	}
	const groups = [...groupAchromatic(grayIndices, hsvColors)];
	const chromaticGroupsByBucket = buckets.map((bucket) => groupChromatic(bucket, hsvColors));
	const flatGroups = [];
	const boundaries = [];
	for (const bucketGroups of chromaticGroupsByBucket) {
		if (bucketGroups.length === 0) {
			boundaries.push({
				first: -1,
				last: -1
			});
			continue;
		}
		const boundary = {
			first: flatGroups.length,
			last: -1
		};
		boundaries.push(boundary);
		flatGroups.push(...bucketGroups);
		boundary.last = flatGroups.length - 1;
	}
	groups.push(...mergeAdjacentBuckets(flatGroups, boundaries, hsvColors));
	return groups;
};
/**
* 相邻彩色桶边界合并
*
* 检查桶 i 的最后一组与桶 i+1 的第一组，若两组代表色的综合距离不超过阈值，
* 则将它们所在的组件合并。
* 使用并查集是为了支持多个相邻边界连续合并。
* 不处理色相环首尾合并。
*/
const mergeAdjacentBuckets = (groups, boundaries, hsvColors) => {
	const parent = Array.from({ length: groups.length }, (_, i) => i);
	const components = /* @__PURE__ */ new Map();
	for (let i = 0; i < groups.length; i++) components.set(i, [[...groups[i]]]);
	const find = (x) => {
		while (parent[x] !== x) {
			parent[x] = parent[parent[x]];
			x = parent[x];
		}
		return x;
	};
	const union = (a, b) => {
		const rootA = find(a);
		const rootB = find(b);
		if (rootA === rootB) return;
		parent[rootB] = rootA;
		components.get(rootA).push(...components.get(rootB));
		components.delete(rootB);
	};
	for (let i = 0; i < 23; i++) {
		const lastIndex = boundaries[i].last;
		const firstIndex = boundaries[i + 1].first;
		if (lastIndex === -1 || firstIndex === -1) continue;
		const rootA = find(lastIndex);
		const rootB = find(firstIndex);
		if (rootA === rootB) continue;
		const repA = averageHsvOfGroups(components.get(rootA), hsvColors);
		const repB = averageHsvOfGroups(components.get(rootB), hsvColors);
		if (hsvDistanceSquared(repA, repB) <= HSV_GROUP_THRESHOLD_SQUARED) union(rootA, rootB);
	}
	const result = [];
	for (const groupArrays of components.values()) {
		const merged = [];
		for (const group of groupArrays) merged.push(...group);
		result.push(merged);
	}
	return result;
};
//#endregion
//#region src/worker/ImageRecognition/colorUtils/lab.ts
/** Oklab 中 a/b 的跨度（约 -0.4 ~ 0.4）。 */
const LAB_AB_RANGE = .8;
/** 预计算 0~255 的 sRGB 线性化值，避免每次转换都执行指数运算 */
const LINEAR_RGB = /* @__PURE__ */ new Float32Array(256);
for (let i = 0; i < 256; i++) {
	const s = i / 255;
	LINEAR_RGB[i] = s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
}
const rgbToOklab = (r, g, b) => {
	const rl = LINEAR_RGB[r];
	const gl = LINEAR_RGB[g];
	const bl = LINEAR_RGB[b];
	const l = .4122214708 * rl + .5363325363 * gl + .0514459929 * bl;
	const m = .2119034982 * rl + .6806995451 * gl + .1073969566 * bl;
	const s = .0883024619 * rl + .2817188376 * gl + .6299787005 * bl;
	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);
	return [
		.2104542553 * l_ + .793617785 * m_ - .0040720468 * s_,
		1.9779984951 * l_ - 2.428592205 * m_ + .4505937099 * s_,
		.0259040371 * l_ + .7827717662 * m_ - .808675766 * s_
	];
};
/** 通过 Oklab 数据获取图片的灰度表 */
const toGrayListByLab = (lab) => {
	const { groupList, groupToLab } = lab;
	const grayList = new Uint8ClampedArray(groupList.length);
	for (let i = 0; i < groupList.length; i++) {
		const group = groupList[i];
		if (group < 0) continue;
		grayList[i] = groupToLab[group * 3] * 255;
	}
	return grayList;
};
//#endregion
//#region src/worker/ImageRecognition/colorUtils/quantization.ts
/**
* 构建统一的 Oklab 像素量化数据。
*
* @param forEachPixel 指定需要参与量化的像素遍历方式（例如只遍历中心区域外）
*/
const buildLabQuantizedData = (img, levels = 42, forEachPixel) => {
	const { width, height } = img;
	const groupCount = levels ** 3;
	const groupList = new Int32Array(width * height);
	groupList.fill(-1);
	const lStep = 1 / levels;
	const abStep = LAB_AB_RANGE / levels;
	const labSums = new Float64Array(groupCount * 3);
	const rgbSums = new Float64Array(groupCount * 3);
	const counts = new Uint32Array(groupCount);
	(forEachPixel ?? ((fn) => {
		for (let i = 0; i < width * height; i++) fn(i);
	}))((index) => {
		const i = index * 4;
		const r = img.data[i];
		const g = img.data[i + 1];
		const b = img.data[i + 2];
		const [L, a, bLab] = rgbToOklab(r, g, b);
		const lGroup = Math.min(levels - 1, Math.max(0, Math.floor(L / lStep)));
		const aGroup = Math.min(levels - 1, Math.max(0, Math.floor((a + LAB_AB_RANGE / 2) / abStep)));
		const bGroup = Math.min(levels - 1, Math.max(0, Math.floor((bLab + LAB_AB_RANGE / 2) / abStep)));
		const group = (lGroup * levels + aGroup) * levels + bGroup;
		groupList[index] = group;
		const labOffset = group * 3;
		labSums[labOffset] += L;
		labSums[labOffset + 1] += a;
		labSums[labOffset + 2] += bLab;
		const rgbOffset = group * 3;
		rgbSums[rgbOffset] += r;
		rgbSums[rgbOffset + 1] += g;
		rgbSums[rgbOffset + 2] += b;
		counts[group] += 1;
	});
	const groupToLab = new Float32Array(groupCount * 3);
	const groupToRgb = new Uint8ClampedArray(groupCount * 3);
	for (let group = 0; group < groupCount; group++) {
		const count = counts[group];
		if (count === 0) continue;
		const offset = group * 3;
		groupToLab[offset] = labSums[offset] / count;
		groupToLab[offset + 1] = labSums[offset + 1] / count;
		groupToLab[offset + 2] = labSums[offset + 2] / count;
		groupToRgb[offset] = Math.round(rgbSums[offset] / count);
		groupToRgb[offset + 1] = Math.round(rgbSums[offset + 1] / count);
		groupToRgb[offset + 2] = Math.round(rgbSums[offset + 2] / count);
	}
	return {
		groupList,
		levels,
		groupToLab,
		groupToRgb
	};
};
//#endregion
//#region src/worker/ImageRecognition/colorUtils/rgb.ts
/** 将 rgb 转换为大写 16 进制颜色值 */
const rgbToHex = (r, g, b) => \`#\${[
	r,
	g,
	b
].map((n) => n.toString(16).padStart(2, "0").toUpperCase()).join("")}\`;
//#endregion
//#region src/worker/ImageRecognition/backgroundDetection/Region.ts
/** 4-连通的相邻像素位置偏移 */
const NEIGHBOR_OFFSETS = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];
var Region = class {
	id;
	/** 该区域包含的所有像素索引 */
	pixelIndexes = [];
	/** 所属的区域管理器 */
	manager;
	/** 区域颜色直方图 */
	colorHistogram = new ColorHistogram();
	constructor(manager, id) {
		this.manager = manager;
		this.id = id;
	}
	/** 当前区域的像素数量 */
	get pixelCount() {
		return this.pixelIndexes.length;
	}
	/** 将像素添加到区域里来，返回是否成功添加 */
	addPixel(index) {
		if (this.manager.getOwner(index) !== 0) return false;
		if (!this.checkPixel(index)) return false;
		if (this.manager.claimPixel(index, this.id)) {
			this.pixelIndexes.push(index);
			this.updateColorHistogram(index);
			this.onPixelAdded(index);
			return true;
		}
		return false;
	}
	/** 将像素的 Oklab 量化分组码加入区域的颜色直方图 */
	updateColorHistogram(index) {
		const group = this.manager.labQuantized.groupList[index];
		if (group >= 0) this.colorHistogram.add(group);
	}
	/**
	* 从种子像素开始，以 4-连通方式将满足 checkPixel 的相邻像素加入当前区域。
	*
	* 如果种子像素无法加入，自动释放当前区域。
	*/
	growFromSeed(seedIndex) {
		if (!this.addPixel(seedIndex)) return this.manager.releaseRegion(this.id);
		const { width, height } = this.manager;
		const queue = [seedIndex];
		let head = 0;
		while (head < queue.length) {
			const current = queue[head];
			head += 1;
			const currentX = current % width;
			const currentY = Math.floor(current / width);
			for (const [dx, dy] of NEIGHBOR_OFFSETS) {
				const nextX = currentX + dx;
				const nextY = currentY + dy;
				if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
				const nextIndex = nextY * width + nextX;
				if (this.manager.getOwner(nextIndex) !== 0) continue;
				if (this.addPixel(nextIndex)) queue.push(nextIndex);
			}
		}
	}
	/** 当另一个区域合并到当前区域时调用，用于合并子类维护的派生状态 */
	onMerged(source) {
		this.colorHistogram.merge(source.colorHistogram);
	}
	/** 遍历该区域包含的所有像素索引 */
	forEachPixel(callback) {
		for (const index of this.pixelIndexes) callback(index);
	}
	/** 获取区域的众数 Oklab */
	getModeLab() {
		const group = this.colorHistogram.getModeKey();
		if (group === void 0) return;
		const lab = this.manager.labQuantized.groupToLab;
		const offset = group * 3;
		return {
			l: lab[offset],
			a: lab[offset + 1],
			b: lab[offset + 2]
		};
	}
	/** 获取区域众数色对应的 Oklab 量化分组 id */
	getQuantizedGroup() {
		return this.colorHistogram.getModeKey();
	}
	/** 获取区域的量化 RGB（Oklab 量化分组对应的平均 RGB，仅用于 HSV 分组） */
	getQuantizedRgb() {
		const group = this.getQuantizedGroup();
		if (group === void 0) return;
		const rgb = this.manager.labQuantized.groupToRgb;
		const offset = group * 3;
		return {
			r: rgb[offset],
			g: rgb[offset + 1],
			b: rgb[offset + 2]
		};
	}
	/**
	* 获取该区域在原图中的主色
	*
	* 从众数 Oklab 分组内取原图 RGB 的精确众数
	*/
	getMainColor() {
		const group = this.colorHistogram.getModeKey();
		if (group === void 0) throw new Error("区域没有像素，无法获取主色");
		const counts = /* @__PURE__ */ new Map();
		let maxKey = 0;
		let maxCount = 0;
		this.forEachPixel((index) => {
			if (this.manager.labQuantized.groupList[index] !== group) return;
			const i = index * 4;
			const r = this.manager.data[i];
			const g = this.manager.data[i + 1];
			const b = this.manager.data[i + 2];
			const key = r << 16 | g << 8 | b;
			const item = counts.get(key);
			if (item) item.count += 1;
			else counts.set(key, {
				count: 1,
				r,
				g,
				b
			});
			const count = item ? item.count : 1;
			if (count > maxCount) {
				maxKey = key;
				maxCount = count;
			}
		});
		const rgb = counts.get(maxKey);
		if (!rgb) throw new Error("区域中不存在主色分组对应的像素");
		return rgbToHex(rgb.r, rgb.g, rgb.b);
	}
};
/**
* 区域管理器
*
* 负责像素归属的统一管理，以及区域实例的注册与查询。
*/
var RegionManager = class {
	/** 图片宽度 */
	width;
	/** 图片高度 */
	height;
	/** 图片像素数据 */
	data;
	/** 统一的 Oklab 像素量化数据 */
	labQuantized;
	/**
	* 记录像素归属情况
	*
	* 值为区域 id：0 表示无归属，>0 表示归属对应 id 的区域，<0 表示保留区域
	*/
	ownership;
	/** 已注册的区域实例，键为区域 id，值为区域对象 */
	regions = /* @__PURE__ */ new Map();
	/** 下一个可分配的区域 id */
	nextId = 1;
	constructor(img) {
		this.width = img.width;
		this.height = img.height;
		this.ownership = new Int32Array(img.width * img.height);
		this.data = img.data;
		this.labQuantized = img.labQuantized;
		this.reserveCenter(img);
	}
	/** 将图片的中间区域标记为保留区域，不参与识别 */
	reserveCenter(img) {
		for (let y = img.bounds.startY; y < img.bounds.endY; y++) for (let x = img.bounds.startX; x < img.bounds.endX; x++) this.claimPixel(y * img.width + x, -1);
	}
	/** 创建并注册一个区域实例 */
	createRegion(RegionClass, ...args) {
		const id = this.nextId;
		this.nextId += 1;
		const region = new RegionClass(this, id, ...args);
		this.regions.set(id, region);
		return region;
	}
	/** 根据 id 获取区域实例 */
	getRegion(id) {
		return this.regions.get(id);
	}
	/** 获取当前所有已注册区域的 id 列表 */
	getRegionIds() {
		return this.regions.keys();
	}
	/** 获取当前已注册区域的数量 */
	getRegionCount() {
		return this.regions.size;
	}
	/** 获取指定像素的归属区域 id */
	getOwner(index) {
		return this.ownership[index];
	}
	/** 将指定像素认领给指定区域，返回是否认领成功 */
	claimPixel(index, regionId) {
		if (this.ownership[index] !== 0) return false;
		this.ownership[index] = regionId;
		return true;
	}
	/** 释放指定像素的归属，返回是否释放成功 */
	releasePixel(index, regionId) {
		if (this.ownership[index] !== regionId) return false;
		this.ownership[index] = 0;
		return true;
	}
	/** 注销区域，释放所属像素 */
	releaseRegion(regionId) {
		const region = this.regions.get(regionId);
		if (!region) return;
		for (const index of region.pixelIndexes) this.ownership[index] = 0;
		region.pixelIndexes.length = 0;
		this.regions.delete(regionId);
	}
	/** 删除所有面积过小的区域，并返回被删除的区域 id 列表 */
	removeSmallRegions() {
		const minPixelCount = Math.max(1, Math.floor(this.width * this.height * MIN_REGION_RATIO));
		for (const id of this.regions.keys()) {
			const region = this.regions.get(id);
			if (region && region.pixelCount < minPixelCount) this.releaseRegion(id);
		}
	}
	/** 合并颜色相似的区域 */
	mergeSimilarRegions() {
		if (this.regions.size <= 1) return;
		const idsByGroup = /* @__PURE__ */ new Map();
		for (const region of this.regions.values()) {
			const group = region.getQuantizedGroup();
			if (group === void 0) continue;
			const ids = idsByGroup.get(group);
			if (ids) ids.push(region.id);
			else idsByGroup.set(group, [region.id]);
		}
		if (idsByGroup.size === 0) return;
		const representativeRgbs = [];
		const representativeGroups = [];
		for (const [group, ids] of idsByGroup) {
			const rgb = this.regions.get(ids[0])?.getQuantizedRgb();
			if (!rgb) continue;
			representativeRgbs.push(rgb);
			representativeGroups.push(group);
		}
		if (representativeRgbs.length === 0) return;
		const groups = groupColorsByHsv(representativeRgbs);
		for (const group of groups) {
			if (group.length === 0) continue;
			let targetId = -1;
			let maxCount = -1;
			for (const representativeIndex of group) {
				const ids = idsByGroup.get(representativeGroups[representativeIndex]);
				if (!ids) continue;
				for (const id of ids) {
					const count = this.regions.get(id)?.pixelCount ?? 0;
					if (count > maxCount) {
						maxCount = count;
						targetId = id;
					}
				}
			}
			for (const representativeIndex of group) {
				const ids = idsByGroup.get(representativeGroups[representativeIndex]);
				if (!ids) continue;
				for (const id of ids) if (id !== targetId) this.mergeRegions(targetId, id);
			}
		}
	}
	/**
	* 将一个区域的所有像素合并到另一个区域，并注销源区域，返回是否合并成功
	*
	* 合并后，源区域的 id 不再有效，目标区域的 pixelCount 会增加源区域的像素数量
	*/
	mergeRegions(targetId, sourceId) {
		const target = this.regions.get(targetId);
		const source = this.regions.get(sourceId);
		if (!target || !source) return false;
		const sourcePixels = source.pixelIndexes;
		const targetPixels = target.pixelIndexes;
		const sourceLength = sourcePixels.length;
		const targetStart = targetPixels.length;
		targetPixels.length = targetStart + sourceLength;
		for (let i = 0; i < sourceLength; i++) {
			const index = sourcePixels[i];
			this.ownership[index] = targetId;
			targetPixels[targetStart + i] = index;
		}
		sourcePixels.length = 0;
		target.onMerged(source);
		this.regions.delete(sourceId);
		return true;
	}
	/** 遍历指定区域的所有像素索引 */
	forEachPixelOfRegion(regionId, callback) {
		this.regions.get(regionId)?.forEachPixel(callback);
	}
};
//#endregion
//#region src/worker/ImageRecognition/backgroundDetection/quantizedEdgeGrow.ts
/** 基于 Oklab 分组的 Region */
var QuantizedRegion = class extends Region {
	group;
	groupList;
	constructor(manager, id, { group, groupList }) {
		super(manager, id);
		this.group = group;
		this.groupList = groupList;
	}
	checkPixel(index) {
		return this.groupList[index] === this.group;
	}
	onPixelAdded() {}
};
/** 从边缘起点区域中未占用的像素开始生长。 */
const growEdgeSeeds = (manager, img, groupList) => {
	const { width, height } = img;
	const edgeX = Math.max(1, Math.floor(width * EDGE_SEED_RATIO));
	const edgeY = Math.max(1, Math.floor(height * EDGE_SEED_RATIO));
	const isInSeedArea = (x, y) => x < edgeX || x >= width - edgeX || y < edgeY || y >= height - edgeY;
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		if (!isInSeedArea(x, y)) continue;
		const index = y * width + x;
		if (manager.getOwner(index) !== 0) continue;
		const group = groupList[index];
		manager.createRegion(QuantizedRegion, {
			group,
			groupList
		}).growFromSeed(index);
	}
};
/**
* 基于 Oklab 量化与边缘种子生长的背景识别：
*
* 1. 使用 ImgContext 上统一的 Oklab 量化数据；
* 2. 从边缘起点区域中未占用的像素出发，以 4-连通的方式遍历，
*    将同一 Oklab 分组的像素合并成一个 Region；
* 3. 生长完成后，合并代表色相似的区域。
*/
const quantizedEdgeGrow = (img, manager) => {
	const { width, height } = img;
	if (width <= 0 || height <= 0) return manager;
	growEdgeSeeds(manager, img, img.labQuantized.groupList);
	img.logger.mark("边缘种子生长完成");
	if (manager.getRegionCount() === 0) return manager;
	manager.mergeSimilarRegions();
	img.logger.mark("相似区域合并完成");
	manager.removeSmallRegions();
	img.logger.mark("小区域清理完成");
	return manager;
};
//#endregion
//#region src/worker/ImageRecognition/backgroundDetection/index.ts
/** 识别出图片的背景区域 */
const detectBackgroundRegions = (img) => {
	if (img.backgroundRegions) return img.backgroundRegions;
	const manager = new RegionManager(img);
	img.logger.mark("区域管理器初始化完成");
	quantizedEdgeGrow(img, manager);
	img.logger.mark("背景区域识别完成");
	img.backgroundRegions = manager;
	return manager;
};
//#endregion
//#region src/worker/ImageRecognition/blankMargin.ts
/**
* 根据参考背景色计算图片四边的空白边缘距离（像素单位）。
*
* 每条边先以最外层行/列的主色作为参考背景色，然后从边缘向内逐行/列扫描。
* 累计与参考色差超过阈值的像素数，一旦超过整边预算就停止。
*/
const getRawBlankMargin = (img) => {
	const { width, height } = img;
	const { groupList, groupToLab, levels } = img.labQuantized;
	const counts = new Uint32Array(levels ** 3);
	const touched = [];
	const resetCounts = () => {
		for (const group of touched) counts[group] = 0;
		touched.length = 0;
	};
	/**
	* 扫描一条边。
	*
	* @param lineLength 行/列长度：左右边用高度，上下边用宽度
	* @param limit 最多扫描多少行/列（由中心保留区边界决定）
	* @param startPos 起始位置：列用 x，行用 y
	* @param step 扫描方向：向内为 1，从右/下边缘向内为 -1
	* @param isColumn true 表示扫描列，false 表示扫描行
	*/
	const scanSide = ({ lineLength, limit, startPos, step, isColumn }) => {
		if (limit <= 0) return 0;
		const maxOutlier = lineLength * BLANK_MARGIN_MAX_OUTLIER_RATIO;
		resetCounts();
		let refGroup = -1;
		let maxCount = 0;
		const firstPos = startPos;
		if (isColumn) for (let offset = 0; offset < lineLength; offset++) {
			const group = groupList[offset * width + firstPos];
			if (group < 0) continue;
			if (counts[group] === 0) touched.push(group);
			const count = ++counts[group];
			if (count > maxCount) {
				maxCount = count;
				refGroup = group;
			}
		}
		else for (let offset = 0; offset < lineLength; offset++) {
			const group = groupList[firstPos * width + offset];
			if (group < 0) continue;
			if (counts[group] === 0) touched.push(group);
			const count = ++counts[group];
			if (count > maxCount) {
				maxCount = count;
				refGroup = group;
			}
		}
		resetCounts();
		if (refGroup < 0) return 0;
		const refOffset = refGroup * 3;
		const refL = groupToLab[refOffset];
		const refA = groupToLab[refOffset + 1];
		const refB = groupToLab[refOffset + 2];
		const toleranceSq = BLANK_MARGIN_COLOR_TOLERANCE ** 2;
		const isOutOfTolerance = (group) => {
			if (group < 0) return true;
			const offset = group * 3;
			const dl = groupToLab[offset] - refL;
			const da = groupToLab[offset + 1] - refA;
			const db = groupToLab[offset + 2] - refB;
			return dl * dl + da * da + db * db > toleranceSq;
		};
		let outlierCount = 0;
		const scanLineAt = (pos) => {
			if (isColumn) for (let offset = 0; offset < lineLength; offset++) {
				const group = groupList[offset * width + pos];
				if (!isOutOfTolerance(group)) continue;
				outlierCount += 1;
				if (outlierCount > maxOutlier) return false;
			}
			else for (let offset = 0; offset < lineLength; offset++) {
				const group = groupList[pos * width + offset];
				if (!isOutOfTolerance(group)) continue;
				outlierCount += 1;
				if (outlierCount > maxOutlier) return false;
			}
			return true;
		};
		if (!scanLineAt(firstPos)) return 0;
		let margin = 1;
		for (let i = 1; i < limit; i++) {
			if (!scanLineAt(startPos + step * i)) return margin;
			margin += 1;
		}
		return margin;
	};
	const { startX, endX, startY, endY } = img.bounds;
	const left = scanSide({
		lineLength: height,
		limit: startX,
		startPos: 0,
		step: 1,
		isColumn: true
	});
	const right = scanSide({
		lineLength: height,
		limit: width - endX,
		startPos: width - 1,
		step: -1,
		isColumn: true
	});
	const top = scanSide({
		lineLength: width,
		limit: startY,
		startPos: 0,
		step: 1,
		isColumn: false
	});
	const bottom = scanSide({
		lineLength: width,
		limit: height - endY,
		startPos: height - 1,
		step: -1,
		isColumn: false
	});
	if (left || right || top || bottom) return {
		left,
		right,
		top,
		bottom
	};
};
/** 获取图片的空白边缘 */
const getBlankMargin = (img) => {
	if (img.blankMargin !== void 0) return img.blankMargin;
	const blankMargin = getRawBlankMargin(img);
	if (!blankMargin) {
		img.logger.mark("空白边缘扫描完成", "未检测到");
		return null;
	}
	blankMargin.left /= img.width;
	blankMargin.right /= img.width;
	blankMargin.top /= img.height;
	blankMargin.bottom /= img.height;
	img.blankMargin = blankMargin;
	img.logger.mark("空白边缘扫描完成", Object.entries(blankMargin).filter(([, v]) => v).map(([k, v]) => \`\${k}:\${v && (v * 100).toFixed(2)}%\`).join(" "));
	return img.blankMargin;
};
/** 计算字符串在等宽终端中的显示宽度，CJK/全角字符按 2 列计算 */
const displayWidth = (text) => {
	let width = 0;
	for (const ch of text) width += ch.codePointAt(0) > 255 ? 2 : 1;
	return width;
};
/** 将日志按列对齐：第一列（时间）右对齐，其余列左对齐 */
const formatLogs = (logs) => {
	if (logs.length === 0) return [];
	const columnCount = Math.max(...logs.map((row) => row.length));
	const columnWidths = Array.from({ length: columnCount }, (_, col) => Math.max(0, ...logs.filter((row) => row[col] !== void 0).map((row) => displayWidth(row[col]))));
	return logs.map((row) => {
		const parts = [];
		for (let col = 0; col < row.length; col++) {
			const value = row[col];
			if (col === row.length - 1) {
				parts.push(value);
				continue;
			}
			if (col === 0 && value === "" && columnWidths[0] === 0) continue;
			const padding = Math.max(0, columnWidths[col] - displayWidth(value));
			parts.push(col === 0 ? " ".repeat(padding) + value : value + " ".repeat(padding));
		}
		return parts.join(" ".repeat(4));
	});
};
var Log = class {
	logs = [];
	startTime = performance.now();
	lastMarkTime = this.startTime;
	/** 记录普通日志，消息会在时间列之后左对齐输出 */
	log(message) {
		this.logs.push(["", message]);
	}
	/**
	* 记录从上一次 mark 到当前时刻的耗时。
	*
	* 第一项为耗时（右对齐），后续字符串参数在时间后依次左对齐输出。
	*/
	mark(label, ...args) {
		const now = performance.now();
		const elapsed = now - this.lastMarkTime;
		this.lastMarkTime = now;
		this.logs.push([
			\`\${elapsed.toFixed(2)}ms\`,
			label,
			...args
		]);
	}
	/** 从图片开始处理到当前时刻的总耗时 */
	get totalTime() {
		return performance.now() - this.startTime;
	}
	/** 格式化所有日志为对齐后的完整字符串 */
	format() {
		return formatLogs(this.logs).join("\\n");
	}
};
//#endregion
//#region src/worker/ImageRecognition/imgContext.ts
/** 图片处理过程中需要共享/累积的状态和工具方法 */
var ImgContext = class {
	data;
	width;
	height;
	url;
	index;
	option;
	version;
	/** 中心保留区域的边界范围 */
	bounds;
	logger = new Log();
	backgroundRegions;
	/**
	* - undefined = 尚未计算
	* - null = 没有空白边缘
	* - 对象 = 计算出的的空白边缘
	*/
	blankMargin;
	/**
	* - undefined = 尚未计算
	* - null = 没有背景色
	*/
	background;
	constructor({ imgData, width, height, url, index, option, version }) {
		this.data = imgData;
		this.width = width;
		this.height = height;
		this.url = url;
		this.index = index;
		this.option = option;
		this.version = version;
		const edgeScanRatio = .6 / 2;
		this.bounds = {
			startX: Math.floor(width * edgeScanRatio),
			endX: Math.ceil(width * .7),
			startY: Math.floor(height * edgeScanRatio),
			endY: Math.ceil(height * .7)
		};
	}
	/** 灰度表 */
	get grayList() {
		if (!this._grayList) {
			this._grayList = this.computeGrayList();
			this.logger.mark("灰度图生成完成");
		}
		return this._grayList;
	}
	_grayList;
	/** Oklab 量化数据 */
	get labQuantized() {
		if (!this._labQuantized) {
			this._labQuantized = buildLabQuantizedData(this, 42, (fn) => this.forEachOutsideCenter(fn));
			this.logger.mark("Oklab 量化完成");
		}
		return this._labQuantized;
	}
	_labQuantized;
	/** 遍历中心区域外的所有像素，按上下左右四个带状区域迭代，避免逐像素判断中心区域 */
	forEachOutsideCenter(fn) {
		const { startX, endX, startY, endY } = this.bounds;
		const { width, height } = this;
		for (let y = 0; y < startY; y++) {
			let index = y * width;
			for (let x = 0; x < width; x++, index++) fn(index);
		}
		for (let y = endY; y < height; y++) {
			let index = y * width;
			for (let x = 0; x < width; x++, index++) fn(index);
		}
		for (let y = startY; y < endY; y++) {
			let index = y * width;
			for (let x = 0; x < startX; x++, index++) fn(index);
			index = y * width + endX;
			for (let x = endX; x < width; x++, index++) fn(index);
		}
	}
	computeGrayList() {
		return toGrayListByLab(this.labQuantized);
	}
	/** 遍历图片的指定行 */
	forEachRows(y, fn, { start = 0, end = this.width } = {}) {
		for (let i = start; i < end; i++) fn(this.width * y + i);
	}
	/** 遍历图片的指定列 */
	forEachCols(x, fn, { start = 0, end = this.height } = {}) {
		for (let i = start; i < end; i++) fn(i * this.width + x);
	}
};
//#endregion
//#region src/worker/ImageRecognition/index.ts
const recognitionImg = async (imgData, data) => {
	await Promise.resolve();
	const img = new ImgContext({
		imgData,
		...data
	});
	if (data.option.pageFill || data.option.crop) {
		const blankMargin = getBlankMargin(img);
		mainFn.setImg({
			url: img.url,
			key: "blankMargin",
			val: blankMargin,
			version: img.version
		});
		if (blankMargin) mainFn.updatePageData();
	}
	if (data.option.background) {
		detectBackgroundRegions(img);
		const background = getBackground(img);
		mainFn.setImg({
			url: img.url,
			key: "background",
			val: background,
			version: img.version
		});
	}
	img.logger.logs.push([\`\${img.logger.totalTime.toFixed(2)}ms\`, "总耗时"]);
	mainFn.log?.(\`\${img.url}\\n\${img.logger.format()}\`);
};
//#endregion
exports.recognitionImg = recognitionImg;
exports.setMainFn = setMainFn;
`,
	"worker/ImageUpscale": `\n//#region \\0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let _tensorflow_tfjs = require("@tensorflow/tfjs");
_tensorflow_tfjs = __toESM(_tensorflow_tfjs, 1);
let _tensorflow_tfjs_backend_webgpu = require("@tensorflow/tfjs-backend-webgpu");
let helper = require("helper");
//#region src/worker/ImageUpscale/image.ts
var Img = class {
	width;
	height;
	data;
	constructor(width, height, data = new Uint8Array(width * height * 4)) {
		this.width = width;
		this.height = height;
		this.data = data;
	}
	getImageCrop(x, y, image, x1, y1, x2, y2) {
		const width = x2 - x1;
		for (let j = 0; j < y2 - y1; j++) {
			const srcIndex = (y1 + j) * image.width * 4 + x1 * 4;
			this.data.set(image.data.subarray(srcIndex, srcIndex + width * 4), (y + j) * this.width * 4 + x * 4);
		}
	}
	padToTileSize(tileSize) {
		let newWidth = this.width;
		let newHeight = this.height;
		if (this.width < tileSize) newWidth = tileSize;
		if (this.height < tileSize) newHeight = tileSize;
		if (newWidth === this.width && newHeight === this.height) return;
		const newData = new Uint8Array(newWidth * newHeight * 4);
		for (let y = 0; y < this.height; y++) {
			const srcStart = y * this.width * 4;
			newData.set(this.data.subarray(srcStart, srcStart + this.width * 4), y * newWidth * 4);
		}
		if (newWidth > this.width) {
			const rightColumnIndex = (this.width - 1) * 4;
			for (let y = 0; y < this.height; y++) {
				const destRowStart = y * newWidth * 4;
				const srcPixelIndex = y * this.width * 4 + rightColumnIndex;
				const padPixel = this.data.subarray(srcPixelIndex, srcPixelIndex + 4);
				for (let x = this.width; x < newWidth; x++) newData.set(padPixel, destRowStart + x * 4);
			}
		}
		if (newHeight > this.height) {
			const bottomRowStart = (this.height - 1) * newWidth * 4;
			const bottomRow = newData.subarray(bottomRowStart, bottomRowStart + newWidth * 4);
			for (let y = this.height; y < newHeight; y++) newData.set(bottomRow, y * newWidth * 4);
		}
		this.width = newWidth;
		this.height = newHeight;
		this.data = newData;
	}
	cropToOriginalSize(width, height) {
		const newData = new Uint8Array(width * height * 4);
		for (let y = 0; y < height; y++) {
			const srcStart = y * this.width * 4;
			newData.set(this.data.subarray(srcStart, srcStart + width * 4), y * width * 4);
		}
		this.width = width;
		this.height = height;
		this.data = newData;
	}
};
//#endregion
//#region src/worker/ImageUpscale/workHelper.ts
const mainFn = {};
const setMainFn = (helper, keys) => {
	for (const name of keys) Reflect.set(mainFn, name, (...args) => Reflect.apply(helper[name], helper, args));
};
const base64ToArrayBuffer = (base64) => {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) bytes[i] = binaryString.codePointAt(i);
	return bytes.buffer;
};
//#endregion
//#region src/worker/ImageUpscale/model.ts
console.debug(_tensorflow_tfjs_backend_webgpu.webgpu_util);
let model;
let loading = false;
const getModel = async () => {
	if (model) return model;
	if (loading) return helper.wait(() => model);
	loading = true;
	try {
		await _tensorflow_tfjs.setBackend("webgpu");
	} catch (error) {
		mainFn.toast.warn(mainFn.t("upscale.webgpu_tip"));
		mainFn.log.error("切换 WebGPU 出错", error);
	}
	const { buffer, base64, json } = await mainFn.getModel();
	Reflect.set(_tensorflow_tfjs.env().platform, "fetch", () => ({
		ok: true,
		json: () => JSON.parse(json),
		arrayBuffer: () => buffer || base64ToArrayBuffer(base64)
	}));
	model = await _tensorflow_tfjs.loadGraphModel("xxx");
	return model;
};
//#endregion
//#region src/worker/ImageUpscale/upscale.ts
const upscaleImg = async (image) => {
	const model = await getModel();
	const result = _tensorflow_tfjs.default.tidy(() => model.predict(img2tensor(image)));
	const resultImage = await tensor2img(result);
	_tensorflow_tfjs.default.dispose(result);
	return resultImage;
};
const img2tensor = (image) => {
	const imgdata = new ImageData(image.width, image.height);
	imgdata.data.set(image.data);
	return _tensorflow_tfjs.default.browser.fromPixels(imgdata).div(255).toFloat().expandDims();
};
const tensor2img = async (tensor) => {
	const [, height, width] = tensor.shape;
	const clipped = _tensorflow_tfjs.default.tidy(() => tensor.reshape([
		height,
		width,
		3
	]).mul(255).cast("int32").clipByValue(0, 255));
	tensor.dispose();
	const data = await _tensorflow_tfjs.default.browser.toPixels(clipped);
	clipped.dispose();
	return new Img(width, height, data);
};
//#endregion
//#region src/worker/ImageUpscale/index.ts
const factor = 2;
const input_size = 128;
const min_lap = 12;
const upscale = async (data, width, height) => {
	const input = new Img(width, height, new Uint8Array(data));
	input.padToTileSize(input_size);
	const output = new Img(width * factor, height * factor);
	let num_x = 1;
	for (; (input_size * num_x - width) / (num_x - 1) < min_lap; num_x++);
	let num_y = 1;
	for (; (input_size * num_y - height) / (num_y - 1) < min_lap; num_y++);
	const locs_x = Array.from({ length: num_x }, () => 0);
	const locs_y = Array.from({ length: num_y }, () => 0);
	const pad_left = Array.from({ length: num_x }, () => 0);
	const pad_top = Array.from({ length: num_y }, () => 0);
	const pad_right = Array.from({ length: num_x }, () => 0);
	const pad_bottom = Array.from({ length: num_y }, () => 0);
	const total_lap_x = input_size * num_x - width;
	const total_lap_y = input_size * num_y - height;
	const base_lap_x = Math.floor(total_lap_x / (num_x - 1));
	const base_lap_y = Math.floor(total_lap_y / (num_y - 1));
	const extra_lap_x = total_lap_x - base_lap_x * (num_x - 1);
	const extra_lap_y = total_lap_y - base_lap_y * (num_y - 1);
	locs_x[0] = 0;
	for (let i = 1; i < num_x; i++) locs_x[i] = locs_x[i - 1] + input_size - base_lap_x - (i <= extra_lap_x ? 1 : 0);
	locs_y[0] = 0;
	for (let i = 1; i < num_y; i++) locs_y[i] = locs_y[i - 1] + input_size - base_lap_y - (i <= extra_lap_y ? 1 : 0);
	pad_left[0] = 0;
	pad_top[0] = 0;
	pad_right[num_x - 1] = 0;
	pad_bottom[num_y - 1] = 0;
	for (let i = 1; i < num_x; i++) pad_left[i] = Math.floor((locs_x[i - 1] + input_size - locs_x[i]) / 2);
	for (let i = 1; i < num_y; i++) pad_top[i] = Math.floor((locs_y[i - 1] + input_size - locs_y[i]) / 2);
	for (let i = 0; i < num_x - 1; i++) pad_right[i] = locs_x[i] + input_size - locs_x[i + 1] - pad_left[i + 1];
	for (let i = 0; i < num_y - 1; i++) pad_bottom[i] = locs_y[i] + input_size - locs_y[i + 1] - pad_top[i + 1];
	for (let i = 0; i < num_x; i++) for (let j = 0; j < num_y; j++) {
		const x1 = locs_x[i];
		const y1 = locs_y[j];
		const x2 = locs_x[i] + input_size;
		const y2 = locs_y[j] + input_size;
		const tile = new Img(input_size, input_size);
		tile.getImageCrop(0, 0, input, x1, y1, x2, y2);
		const scaled = await upscaleImg(tile);
		output.getImageCrop((x1 + pad_left[i]) * factor, (y1 + pad_top[j]) * factor, scaled, pad_left[i] * factor, pad_top[j] * factor, scaled.width - pad_right[i] * factor, scaled.height - pad_bottom[j] * factor);
	}
	return output;
};
const upscaleImage = async (data, width, height, url) => {
	const startTime = Date.now();
	const output = await upscale(data, width, height);
	const canvas = new OffscreenCanvas(output.width, output.height);
	const ctx = canvas.getContext("2d");
	const imgData = ctx.createImageData(output.width, output.height);
	for (let i = 0; i < imgData.data.length; i++) imgData.data[i] = output.data[i];
	ctx.putImageData(imgData, 0, 0);
	const blob = await canvas.convertToBlob({ type: "image/png" });
	mainFn.setImg(url, "upscaleUrl", URL.createObjectURL(blob));
	mainFn.log?.(\`\${url}\\n\${width}x\${height}\\n耗时 \${Date.now() - startTime}ms 放大完成\`);
};
//#endregion
exports.setMainFn = setMainFn;
exports.upscaleImage = upscaleImage;
`,
	"userscript/otherSite": `\nlet solid_js_web = require("solid-js/web");
let core = require("core");
let helper = require("helper");
let userscript_autoImageScanner = require("userscript/autoImageScanner");
//#region src/userscript/otherSite/index.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<div><button>\`);
/** 执行脚本操作。如果中途中断，将返回 true */
const otherSite = async () => {
	let laseScroll = window.scrollY;
	const { store, setState, options, setOptions } = await core.useInit(location.hostname, {
		remember_current_site: true,
		selector: ""
	});
	helper.createEffectOn(() => options.remember_current_site, async (remember) => {
		if (remember) return;
		await GM.deleteValue(location.hostname);
		location.reload();
	});
	if (!store.flag.isStored) core.toast(() => (() => {
		var _el$ = _tmpl$(), _el$2 = _el$.firstChild;
		solid_js_web.insert(_el$, () => helper.t("site.simple.auto_read_mode_message"), _el$2);
		solid_js_web.addEventListener(_el$2, "click", () => setOptions({ autoShow: false }));
		solid_js_web.insert(_el$2, () => helper.t("other.disable"));
		return _el$;
	})(), { duration: 7e3 });
	const menuId = await GM.registerMenuCommand(helper.t("site.simple.simple_read_mode"), () => setOptions({ selector: "" }));
	await GM.unregisterMenuCommand(menuId);
	let timeout = 0;
	const scanner = new userscript_autoImageScanner.AutoImageScanner({
		selector: options.selector,
		onImgListChange: (imgList) => setState("comicMap", "", "imgList", imgList),
		onEmpty: () => setState((state) => {
			state.fab.show = false;
			state.manga.show = false;
		}),
		onChapterSwitchChange: ({ next, prev }) => setState("manga", {
			onPrev: prev,
			onNext: next
		}),
		onSelectorSuggest: (selector) => setOptions({ selector }),
		shouldTriggerLazyLoad: () => store.manga.show || !timeout && store.manga.imgList.length === 0,
		sortImageByTop: true
	});
	helper.exposeToGlobal({ scanner });
	setState("comicMap", "", { async getImgList() {
		if (scanner.imgList.length === 0) {
			scanner.start();
			scanner.triggerLazyLoad();
			timeout = window.setTimeout(() => {
				if (store.manga.imgList.length > 0) return;
				core.toast.warn(helper.t("site.simple.no_img"), {
					id: "no_img",
					duration: Infinity,
					onClick() {
						setOptions({ remember_current_site: false });
						location.reload();
					}
				});
			}, 3e3);
		}
		await scanner.waitFirstImage(Infinity);
		core.toast.dismiss("no_img");
		return scanner.imgList;
	} });
	setState("manga", { onShowImgsChange: helper.throttle((showImgs) => {
		if (!store.manga.show) return;
		scanner.slotElements[[...showImgs].at(-1)]?.scrollIntoView({
			behavior: "instant",
			block: "end"
		});
	}, 1e3) });
	helper.createEffectOn(() => store.manga.show, (show) => {
		if (show) {
			laseScroll = window.scrollY;
			scanner.triggerLazyLoad();
		} else window.scroll({
			top: laseScroll,
			behavior: "instant"
		});
	});
	helper.onUrlChange((lastUrl, nowUrl) => {
		if (!lastUrl || lastUrl.split("/").length === nowUrl.split("/").length) return;
		setState("comicMap", "", "imgList", void 0);
	});
};
//#endregion
exports.otherSite = otherSite;
`,
	"userscript/ehTagRules": `\n//#region src/userscript/ehTagRules/index.ts
const rules = {
	"prerequisite": {
		"(x|f):incest": [
			"f:cousin",
			"f:aunt",
			"f:daughter",
			"f:mother",
			"f:granddaughter",
			"f:sister",
			"f:grandmother",
			"f:niece"
		],
		"(x|m):incest": ["m:cousin"],
		"f:incest": ["f:inseki", "f:low_incest"],
		"m:incest": ["m:inseki", "m:low_incest"],
		"x:incest": ["x:inseki", "x:low_incest"],
		"f:group": [
			"f:fff_threesome",
			"f:ttt_threesome",
			"f:fft_threesome",
			"f:ttf_threesome"
		],
		"m:group": ["m:mmm_threesome"],
		"x:group": [
			"x:mmf_threesome",
			"x:mmt_threesome",
			"x:ttm_threesome",
			"x:ffm_threesome",
			"x:mtf_threesome",
			"x:oyakodon",
			"x:shimaidon",
			"x:gang_rape"
		],
		"(x|f):group": [
			"f:oyakodon",
			"f:shimaidon",
			"f:multiple_straddling",
			"f:gang_rape",
			"f:layer_cake",
			"f:harem"
		],
		"(x|m):group": [
			"m:oyakodon",
			"m:shimaidon",
			"m:multiple_straddling",
			"m:gang_rape",
			"m:layer_cake",
			"m:harem"
		],
		"f:yuri": ["f:fff_threesome"],
		"m:yaoi": ["m:group", "m:mmm_threesome"],
		"f:futanari": [
			"f:ttt_threesome",
			"f:fft_threesome",
			"f:ttf_threesome",
			"f:full-packaged_futanari",
			"f:futanarization"
		],
		"f:shemale": ["f:ball-less_shemale"],
		"f:lolicon": [
			"f:kodomo_doushi",
			"x:kodomo_doushi",
			"f:oppai_loli",
			"f:mesugaki",
			"f:low_lolicon"
		],
		"m:shotacon": ["m:kodomo_doushi", "x:kodomo_doushi"],
		"f:blowjob": [
			"f:multimouth_blowjob",
			"f:blowjob_face",
			"f:deepthroat",
			"f:focus_blowjob"
		],
		"m:blowjob": [
			"m:multimouth_blowjob",
			"m:blowjob_face",
			"m:deepthroat",
			"m:focus_blowjob"
		],
		"f:handjob": ["f:multiple_handjob"],
		"m:handjob": ["m:multiple_handjob"],
		"f:assjob": ["f:multiple_assjob"],
		"m:assjob": ["m:multiple_assjob"],
		"f:footjob": ["f:multiple_footjob"],
		"m:footjob": ["m:multiple_footjob"],
		"f:paizuri": ["f:focus_paizuri"],
		"m:paizuri": ["m:focus_paizuri"],
		"f:rimjob": ["f:focus_rimjob"],
		"m:rimjob": ["m:focus_rimjob"],
		"f:cunnilingus": ["f:focus_cunnilingus"],
		"f:anal": [
			"f:focus_anal",
			"f:anal_intercourse",
			"f:tail_plug",
			"f:butt_plug"
		],
		"m:anal": [
			"m:focus_anal",
			"m:anal_intercourse",
			"m:tail_plug",
			"m:butt_plug"
		],
		"f:rape": ["f:gang_rape"],
		"m:rape": ["m:gang_rape"],
		"(f|m):corpse": ["f:necrophilia", "m:necrophilia"],
		"(f|m):masturbation": ["f:phone_sex", "m:phone_sex"],
		"f:bondage": [
			"f:fanny_packing",
			"f:shibari",
			"f:straitjacket"
		],
		"m:bondage": [
			"m:fanny_packing",
			"m:shibari",
			"m:straitjacket"
		],
		"f:inflation": ["f:cumflation"],
		"m:inflation": ["m:cumflation"],
		"f:lactation": ["f:milking"],
		"m:lactation": ["m:milking"],
		"f:piercing": ["f:nipple_piercing", "f:genital_piercing"],
		"m:piercing": ["m:nipple_piercing", "m:genital_piercing"],
		"f:big_breasts": ["f:huge_breasts", "f:gigantic_breasts"],
		"f:huge_breasts": ["f:gigantic_breasts"],
		"f:sex_toys": [
			"f:tail_plug",
			"f:butt_plug",
			"f:unusual_insertions"
		],
		"m:sex_toys": [
			"m:tail_plug",
			"m:butt_plug",
			"m:unusual_insertions"
		],
		"f:swimsuit": ["f:bikini"],
		"m:swimsuit": ["m:bikini"],
		"f:crossdressing": ["f:schoolboy_uniform"],
		"f:bandages": ["f:sarashi"],
		"f:monster_girl": ["f:zombie", "f:skeleton"],
		"f:tail": ["f:multiple_tails"],
		"(f|m):robot": ["f:dismantling", "m:dismantling"]
	},
	"conflict": {
		"f:females_only": [
			"f:futanari",
			"f:bisexual",
			"f:ttt_threesome",
			"f:fft_threesome",
			"f:ttf_threesome",
			"x:mmf_threesome",
			"x:mmt_threesome",
			"x:ttm_threesome",
			"x:mtf_threesome",
			"x:group",
			"m:*",
			"x:*"
		],
		"f:sole_female": [
			"f:ttt_threesome",
			"f:fft_threesome",
			"x:mmt_threesome",
			"x:ttm_threesome",
			"m:mmm_threesome"
		],
		"f:sole_dickgirl": [
			"f:fff_threesome",
			"f:ttt_threesome",
			"f:ttf_threesome",
			"x:mmf_threesome",
			"x:ttm_threesome",
			"m:mmm_threesome"
		]
	},
	"possibleConflict": {
		"f:dark_skin": ["f:tanlines"],
		"m:dark_skin": ["m:tanlines"],
		"f:lolicon": ["f:small_breasts"],
		"f:breast_feeding": ["f:nipple_stimulation"]
	},
	"combo": {
		"f:kemonomimi": [
			"f:horse_girl",
			"f:dog_girl",
			"f:mouse_girl",
			"f:bunny_girl",
			"f:catgirl",
			"f:cowgirl",
			"c:amiya",
			"c:rosmontis",
			"c:suzuran",
			"c:shamare",
			"c:schwarz"
		],
		"f:tail": [
			"f:horse_girl",
			"c:suzuran",
			"c:schwarz",
			"c:yuko_yoshida"
		],
		"f:leotard": ["f:bunny_girl"],
		"f:horns": ["f:oni", "c:yuko_yoshida"],
		"f:horse_girl": ["p:uma_musume_pretty_derby"],
		"f:halo": [
			"p:blue_archive",
			"c:nagisa_kirifuji",
			"c:mika_misono"
		],
		"f:zombie": ["p:zombie_land_saga"],
		"f:hair_buns": [
			"c:ayumu_uehara",
			"c:yoshiko_tsushima",
			"c:chisato_arashi",
			"c:ceylon"
		],
		"f:twintails": [
			"c:yu_takasaki",
			"c:rurino_osawa",
			"c:sayaka_murano",
			"c:nico_yazawa",
			"c:nozomi_tojo",
			"c:ruby_kurosawa",
			"c:ria_kazuno",
			"c:arisa_ichigaya",
			"c:himari_uehara",
			"c:ako_udagawa",
			"c:reona_nyubara",
			"c:tsukushi_futaba",
			"c:kotone_fujita"
		],
		"f:ponytail": [
			"c:hime_anyoji",
			"c:eli_ayase",
			"c:honoka_kosaka",
			"c:kanan_matsuura",
			"c:seira_kazuno",
			"c:ren_hazuki",
			"c:saaya_yamabuki",
			"c:nijika_ijichi",
			"c:schwarz",
			"c:mafuyu_asahina"
		],
		"f:very_long_hair": [
			"c:hitori_gotou",
			"c:nijika_ijichi",
			"c:euphyllia_magenta",
			"c:nagisa_kirifuji",
			"c:mika_misono",
			"c:kanade_yoisaki"
		],
		"f:lolicon": ["c:suzuran", "c:shamare"],
		"f:multiple_tails": ["c:suzuran"],
		"f:wings": [
			"c:remilia_scarlet",
			"c:flandre_scarlet",
			"c:koakuma",
			"c:nagisa_kirifuji",
			"c:mika_misono"
		],
		"f:vampire": ["c:remilia_scarlet", "c:flandre_scarlet"],
		"f:demon_girl": ["c:koakuma", "c:yuko_yoshida"],
		"f:thick_eyebrows": ["c:suletta_mercury"],
		"f:glasses": ["c:junna_hoshimi"],
		"f:beauty_mark": ["c:misuzu_hataya"],
		"m:crossdressing": ["c:mizuki_akiyama"],
		"f:angel": ["c:nagisa_kirifuji", "c:mika_misono"]
	}
};
const getTagLintRules = () => {
	const shortNamespace = new Map([
		["p", "parody"],
		["c", "character"],
		["g", "group"],
		["a", "artist"],
		["m", "male"],
		["f", "female"],
		["x", "mixed"],
		["o", "other"]
	].map(([short, full]) => [new RegExp(\`\\\\b\${short}\\\\b(?=.*:)\`, "u"), full]));
	const getTagName = (tag) => {
		let fullTag = tag;
		for (const re of shortNamespace.keys()) if (re.test(fullTag)) fullTag = fullTag.replace(re, shortNamespace.get(re));
		return fullTag;
	};
	const createRuleMap = (map, reverse = false) => {
		const ruleMap = /* @__PURE__ */ new Map();
		if (reverse) for (let [targetTag, tags] of Object.entries(map)) {
			targetTag = getTagName(targetTag);
			for (let tag of tags) {
				tag = getTagName(tag);
				if (ruleMap.has(tag)) ruleMap.get(tag).add(targetTag);
				else ruleMap.set(tag, /* @__PURE__ */ new Set([targetTag]));
			}
		}
		else for (const [tag, targetTag] of Object.entries(map)) ruleMap.set(getTagName(tag), new Set(targetTag.map(getTagName)));
		return ruleMap;
	};
	return {
		prerequisite: createRuleMap(rules.prerequisite, true),
		conflict: createRuleMap(rules.conflict),
		possibleConflict: createRuleMap(rules.possibleConflict),
		combo: createRuleMap(rules.combo, true)
	};
};
/** 拆分多个命名空间的标签 */
const splitTagNamespace = (tag) => {
	if (!tag.startsWith("(")) return [tag];
	const { namespaces, tagName } = /\\((?<namespaces>.+?)\\)(?<tagName>.+)/u.exec(tag).groups;
	return namespaces.split("|").map((namespace) => \`\${namespace}\${tagName}\`);
};
/** 判断是否缺少指定命名空间下的标签 */
const isMissingNamespace = (tagList, ...namespaces) => {
	for (const namespace of namespaces) for (const tag of tagList) if (tag.startsWith(namespace)) return false;
	return true;
};
/** 检查标签是否存在 */
const hasTag = (tagList, tagName) => {
	if (tagName.startsWith("(")) {
		for (const tag of splitTagNamespace(tagName)) if (tagList.has(tag)) return true;
	}
	if (tagName.endsWith(":*")) return !isMissingNamespace(tagList, tagName.split(":*")[0]);
	return tagList.has(tagName);
};
/** 判断是否缺少指定标签 */
const isMissingTags = (tagList, ...tags) => {
	for (const tag of tags) if (tagList.has(tag)) return false;
	return true;
};
//#endregion
exports.getTagLintRules = getTagLintRules;
exports.hasTag = hasTag;
exports.isMissingNamespace = isMissingNamespace;
exports.isMissingTags = isMissingTags;
exports.splitTagNamespace = splitTagNamespace;
`,
	"site/copymanga": `\nlet solid_js_web = require("solid-js/web");
let core = require("core");
let helper = require("helper");
let request = require("request");
let solid_js = require("solid-js");
let userscript_copyApi = require("userscript/copyApi");
//#region src/site/copymanga.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<span>\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<div class=table-default><div class=table-default-title><ul class="nav nav-tabs"role=tablist></ul><div class=table-default-right><span>更新內容：</span><a target=_blank></a><span>更新時間：</span><span></span></div></div><div class=table-default-box><div class=tab-content>\`);
var _tmpl$3 = /*#__PURE__*/ solid_js_web.template(\`<div class="detailsTextContentTabs van-tabs van-tabs--line">\`);
var _tmpl$4 = /*#__PURE__*/ solid_js_web.template(\`<div class=van-tabs__wrap><div role=tablist class="van-tabs__nav van-tabs__nav--line"style=background:transparent><div role=tab class="van-tab van-tab--active"><span class="van-tab__text van-tab__text--ellipsis"><span></span></span></div><div class=van-tabs__line style="width:0.24rem;transform:translateX(187.5px) translateX(-50%);transition-duration:0.3s">\`);
var _tmpl$5 = /*#__PURE__*/ solid_js_web.template(\`<div class=van-tab__pane><div class="chapterList van-grid"style=padding-left:0.24rem>\`);
var _tmpl$6 = /*#__PURE__*/ solid_js_web.template(\`<div class="chapterItem oneLines van-grid-item"style=flex-basis:25%;padding-right:0.24rem;margin-top:0.24rem><a class="van-grid-item__content van-grid-item__content--center"><span class=van-grid-item__text>\`);
var _tmpl$7 = /*#__PURE__*/ solid_js_web.template(\`<li class=nav-item><a class=nav-link data-toggle=tab role=tab aria-selected=false>\`);
var _tmpl$8 = /*#__PURE__*/ solid_js_web.template(\`<div role=tabpanel class="tab-pane fade"><ul>\`);
var _tmpl$9 = /*#__PURE__*/ solid_js_web.template(\`<a target=_blank style=display:block><li>\`);
var _tmpl$0 = /*#__PURE__*/ solid_js_web.template(\`<div class=card style="max-width:100em;margin:1em auto"><div class=card-body><h2 class=card-title></h2><ul>\`);
var _tmpl$1 = /*#__PURE__*/ solid_js_web.template(\`<a class="btn btn-outline-primary">\`);
const token = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="))?.replace("token=", "");
const mobileApi = new class {
	headers = {
		webp: "1",
		region: "1",
		"User-Agent": "COPY/3.0.0",
		version: "3.0.9",
		source: "copyApp",
		referer: "com.copymanga.app-3.0.0",
		Authorization: token ? \`Token \${token}\` : ""
	};
	get = (url, details, ...args) => core.request(url, {
		responseType: "json",
		headers: this.headers,
		...details
	}, ...args);
	eachGet = (url, details) => request.eachApi(url, [
		"https://mapi.copy20.com",
		"https://api.mangacopy.com",
		"https://api.copy3000.com",
		"https://api.2026copy.com",
		"https://api.copy4000.com"
	], {
		responseType: "json",
		headers: {
			...this.headers,
			accept: "application/json"
		},
		fetch: false,
		...details
	});
}();
const pcApi = new class {
	headers = {
		"User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 Edg/141.0.0.0",
		"x-requested-with": "com.manga2020.app",
		platform: "3",
		version: "2024.4.28",
		webp: "1",
		accept: "application/json",
		referer: location.href,
		Authorization: token ? \`Token \${token}\` : ""
	};
	eachGet = (url, details) => request.eachApi(url, [
		"https://mapi.hotmangasf.com",
		"https://api.2024manga.com",
		"https://mapi.hotmangasd.com",
		"https://mapi.fgjfghkk.club",
		"https://m.manga2025.com",
		"https://www.manga2025.com",
		"https://mapi.hotmangasg.com",
		"https://www.manga2026.xyz",
		"https://api.manga2025.com",
		"https://mapi.elfgjfghkk.club",
		"https://mapi.fgjfghkkcenter.club"
	], {
		responseType: "json",
		headers: this.headers,
		fetch: false,
		...details
	});
}();
const handleLastChapter = (comicName) => {
	let a;
	const stylesheet = new CSSStyleSheet();
	document.adoptedStyleSheets.push(stylesheet);
	const updateLastChapter = async () => {
		if (!a) (async () => {
			a = document.createElement("a");
			const tableRight = await helper.wait(() => helper.querySelector(".table-default-right"));
			a.target = "_blank";
			tableRight.firstElementChild?.before(a);
			const span = document.createElement("span");
			span.textContent = "最後閱讀：";
			tableRight.firstElementChild?.before(span);
		})();
		a.textContent = "獲取中";
		a.removeAttribute("href");
		try {
			const data = (await mobileApi.eachGet(\`/api/v3/comic2/\${comicName}/query?platform=3\`, { errorText: "獲取閱讀記錄失敗" })).response?.results?.browse;
			if (!data) {
				a.textContent = data === null ? "無" : "未返回數據";
				return;
			}
			const lastChapterId = data.chapter_id;
			if (!lastChapterId) {
				a.textContent = "接口異常";
				return;
			}
			await stylesheet.replace(\`ul a[href*="\${lastChapterId}"] {
        color: #fff !important;
        background: #1790E6;
      }\`);
			a.href = \`\${location.pathname}/chapter/\${lastChapterId}\`;
			a.textContent = data.chapter_name;
		} catch {
			a.textContent = "獲取閱讀記錄失敗";
		}
	};
	setTimeout(updateLastChapter);
	document.addEventListener("visibilitychange", updateLastChapter);
};
const buildChapters = async (comicName, hiddenType) => {
	const { response: { results } } = await mobileApi.get(\`/comicdetail/\${comicName}/chapters\`, { errorText: "加載漫畫目錄失敗" });
	const data = await userscript_copyApi.decryptData(results);
	helper.log(data);
	const { build: { type }, groups } = data;
	const Group = (props) => {
		const chapters = Object.fromEntries(type.map(({ id }) => [id, []]));
		for (const chapter of props.chapters) chapters[chapter.type].push(chapter);
		return solid_js_web.createComponent(solid_js.Switch, { get children() {
			return [
				solid_js_web.createComponent(solid_js.Match, {
					when: hiddenType === "mobile",
					get children() {
						return (() => {
							for (const dom of helper.querySelectorAll(".van-divider")) dom.remove();
							return (() => {
								var _el$10 = _tmpl$3();
								solid_js_web.insert(_el$10, solid_js_web.createComponent(solid_js.For, {
									each: type,
									children: ({ id, name }) => solid_js_web.createComponent(solid_js.Show, {
										get when() {
											return chapters[id].length;
										},
										get children() {
											return [(() => {
												var _el$11 = _tmpl$4(), _el$13 = _el$11.firstChild.firstChild, _el$15 = _el$13.firstChild.firstChild;
												_el$13.nextSibling;
												solid_js_web.insert(_el$15, name);
												return _el$11;
											})(), (() => {
												var _el$17 = _tmpl$5(), _el$18 = _el$17.firstChild;
												solid_js_web.insert(_el$18, solid_js_web.createComponent(solid_js.For, {
													get each() {
														return chapters[id];
													},
													children: (chapter) => (() => {
														var _el$19 = _tmpl$6(), _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild;
														solid_js_web.insert(_el$21, () => chapter.name);
														solid_js_web.effect((_p$) => {
															var _v$ = !!(props.last_chapter.uuid === chapter.id), _v$2 = \`/comic/\${comicName}/chapter/\${chapter.id}\`;
															_v$ !== _p$.e && _el$19.classList.toggle("red", _p$.e = _v$);
															_v$2 !== _p$.t && solid_js_web.setAttribute(_el$20, "href", _p$.t = _v$2);
															return _p$;
														}, {
															e: void 0,
															t: void 0
														});
														return _el$19;
													})()
												}));
												return _el$17;
											})()];
										}
									})
								}));
								return _el$10;
							})();
						})();
					}
				}),
				solid_js_web.createComponent(solid_js.Match, {
					when: hiddenType === "web",
					get children() {
						return [(() => {
							var _el$ = _tmpl$();
							solid_js_web.insert(_el$, () => props.name);
							return _el$;
						})(), (() => {
							var _el$2 = _tmpl$2(), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$7 = _el$4.nextSibling.firstChild.nextSibling, _el$9 = _el$7.nextSibling.nextSibling, _el$1 = _el$3.nextSibling.firstChild;
							solid_js_web.insert(_el$4, solid_js_web.createComponent(solid_js.For, {
								each: type,
								children: ({ id, name }) => (() => {
									var _el$22 = _tmpl$7(), _el$23 = _el$22.firstChild;
									solid_js_web.insert(_el$23, name);
									solid_js_web.effect((_p$) => {
										var _v$3 = !!(chapters[id].length === 0), _v$4 = \`#\${props.path_word}\${name}\`;
										_v$3 !== _p$.e && _el$23.classList.toggle("disabled", _p$.e = _v$3);
										_v$4 !== _p$.t && solid_js_web.setAttribute(_el$23, "href", _p$.t = _v$4);
										return _p$;
									}, {
										e: void 0,
										t: void 0
									});
									return _el$22;
								})()
							}));
							solid_js_web.insert(_el$7, () => props.last_chapter.name);
							solid_js_web.insert(_el$9, () => props.last_chapter.datetime_created);
							solid_js_web.insert(_el$1, solid_js_web.createComponent(solid_js.For, {
								each: type,
								children: ({ id, name }) => (() => {
									var _el$24 = _tmpl$8(), _el$25 = _el$24.firstChild;
									solid_js_web.insert(_el$25, solid_js_web.createComponent(solid_js.For, {
										get each() {
											return chapters[id];
										},
										children: (chapter) => (() => {
											var _el$26 = _tmpl$9(), _el$27 = _el$26.firstChild;
											solid_js_web.insert(_el$27, () => chapter.name);
											solid_js_web.effect((_p$) => {
												var _v$5 = \`/comic/\${comicName}/chapter/\${chapter.id}\`, _v$6 = chapter.name;
												_v$5 !== _p$.e && solid_js_web.setAttribute(_el$26, "href", _p$.e = _v$5);
												_v$6 !== _p$.t && solid_js_web.setAttribute(_el$26, "title", _p$.t = _v$6);
												return _p$;
											}, {
												e: void 0,
												t: void 0
											});
											return _el$26;
										})()
									}));
									solid_js_web.effect(() => solid_js_web.setAttribute(_el$24, "id", \`\${props.path_word}\${name}\`));
									return _el$24;
								})()
							}));
							solid_js_web.effect(() => solid_js_web.setAttribute(_el$7, "href", \`/comic/\${comicName}/chapter/\${props.last_chapter.comic_id}\`));
							return _el$2;
						})()];
					}
				}),
				solid_js_web.createComponent(solid_js.Match, {
					when: true,
					get children() {
						return solid_js_web.createComponent(solid_js.For, {
							each: type,
							children: ({ id, name }) => solid_js_web.createComponent(solid_js.Show, {
								get when() {
									return chapters[id].length;
								},
								get children() {
									var _el$28 = _tmpl$0(), _el$30 = _el$28.firstChild.firstChild, _el$31 = _el$30.nextSibling;
									solid_js_web.insert(_el$30, name);
									solid_js_web.insert(_el$31, solid_js_web.createComponent(solid_js.For, {
										get each() {
											return chapters[id];
										},
										children: (chapter) => (() => {
											var _el$32 = _tmpl$1();
											solid_js_web.insert(_el$32, () => chapter.name);
											solid_js_web.effect((_p$) => {
												var _v$7 = !!(props.last_chapter.uuid === chapter.id), _v$8 = \`/comic/\${comicName}/chapter/\${chapter.id}\`;
												_v$7 !== _p$.e && _el$32.classList.toggle("active", _p$.e = _v$7);
												_v$8 !== _p$.t && solid_js_web.setAttribute(_el$32, "href", _p$.t = _v$8);
												return _p$;
											}, {
												e: void 0,
												t: void 0
											});
											return _el$32;
										})()
									}));
									return _el$28;
								}
							})
						});
					}
				})
			];
		} });
	};
	let root;
	switch (hiddenType) {
		case "mobile":
			root = helper.querySelector(".detailsTextContent");
			for (const element of helper.querySelectorAll("button.van-dialog__confirm")) element.click();
			break;
		case "web":
			root = helper.querySelector(".upLoop");
			break;
		default:
			root = helper.querySelector("main");
			root.textContent = "";
			helper.css\`
        ul .btn {
          width: fit-content;
          height: fit-content;
          margin: 1em;
        }
      \`;
	}
	solid_js_web.render(() => solid_js_web.createComponent(solid_js.For, {
		get each() {
			return Object.values(groups);
		},
		children: Group
	}), root);
	for (const group of helper.querySelectorAll(".upLoop .table-default-title")) group.querySelector(".nav-link:not(.disabled)")?.click();
};
core.setupSiteAdapter({
	name: "copymanga",
	getPageContext: async () => {
		let comicName = "";
		let id = "";
		if (location.href.includes("/chapter/")) [, , comicName, , id] = location.pathname.split("/");
		else if (location.href.includes("/comicContent/")) [, , , comicName, id] = location.pathname.split("/");
		if (comicName && id) return {
			type: "manga",
			comicName,
			id
		};
		if (!id && location.href.includes("/comic/")) {
			[, comicName] = location.href.split("/comic/");
			if (!comicName) return;
			const isMobile = location.href.includes("/h5/");
			let hiddenType;
			if (document.title === "404 - 拷貝漫畫") hiddenType = isMobile ? "mobile" : "404";
			else if (isMobile) {
				await helper.wait(() => helper.querySelector(".van-toast__text")?.parentElement?.style.display === "none");
				hiddenType = await helper.wait(() => {
					if (helper.querySelector(".isBan")?.textContent?.includes("不提供閱覽")) return "mobile";
					const dialog = helper.querySelector(".van-dialog__message");
					if (dialog?.textContent?.includes("漫畫未找到")) {
						dialog.textContent = "漫畫未找到!\\n請坐和放寬，等待目錄生成";
						for (const element of helper.querySelectorAll(".detailsTextContentTabs")) element.remove();
						return "mobile";
					}
				}, 1e3);
			} else if (Boolean(helper.querySelector(".wargin")?.textContent?.includes("不提供閱覽")) || !await helper.wait(() => helper.querySelector(".upLoop .table-default-title"), 1e3)) hiddenType = helper.querySelector(".comicParticulars-title") ? "web" : "404";
			return {
				type: "catalog",
				comicName,
				hiddenType,
				isMobile
			};
		}
	},
	handlers: {
		manga: ({ setState }, { comicName, id }) => {
			/** 漫画不存在时才会出现的提示 */
			const titleDom = helper.querySelector("main .img+.title");
			if (titleDom) titleDom.textContent = "ComicRead 提示您：你訪問的內容暫不存在，請點選右下角按鈕嘗試加載漫畫";
			/** 通过网页 API 加载漫画（可以获取隐藏漫画） */
			const getImglistByApi = async () => {
				const res = await pcApi.eachGet(\`/api/v3/comic/\${comicName}/chapter/\${id}?platform=3\`, { noCheckCode: true });
				if (res.status !== 200) {
					const message = \`漫畫加載失敗：\${res.response.message || res.status}\`;
					if (titleDom) titleDom.textContent = message;
					throw new Error(message);
				}
				if (titleDom) {
					titleDom.textContent = "漫畫加載成功🥳";
					const { chapter: { name: chapterName }, comic: { name } } = res.response.results;
					document.title = \`\${name} - \${chapterName} - 拷貝漫畫 拷贝漫画\`;
				}
				if (titleDom ?? !helper.querySelector(".comicContent-next")) {
					const { chapter: { next, prev } } = res.response.results;
					setState("manga", {
						onNext: next ? () => location.assign(\`/comic/\${comicName}/chapter/\${next}\`) : void 0,
						onPrev: prev ? () => location.assign(\`/comic/\${comicName}/chapter/\${prev}\`) : void 0
					});
				}
				return res.response.results.chapter.contents.map(({ url }) => url.replace(/(?<=(?<sep>\\/|\\.))c800x/u, "c1500x"));
			};
			setState("comicMap", "", { async getImgList() {
				if (helper.querySelector(".comicContent-next")) setState("manga", {
					onNext: helper.querySelectorClick(".comicContent-next a:not(.prev-null)"),
					onPrev: helper.querySelectorClick(".comicContent-prev:not(.index,.list) a:not(.prev-null)")
				});
				if (titleDom) return getImglistByApi();
				try {
					const imgList = await userscript_copyApi.getImglistByHtml(\`\${location.origin}/comic/\${comicName}/chapter/\${id}\`);
					if (imgList.length === 0) throw new Error("解析網頁變量失敗");
					return imgList;
				} catch (error) {
					helper.log.error(error);
					return getImglistByApi();
				}
			} });
			const getCommentList = async (commentList = []) => {
				const chapter_id = location.pathname.split("/").at(-1);
				const res = await mobileApi.eachGet(\`/api/v3/roasts?chapter_id=\${chapter_id}&limit=100&offset=\${commentList.length}&_update=true\`, {
					errorText: "獲取漫畫評論失敗",
					responseType: "blob"
				});
				const { list, total } = JSON.parse(await res.response.text()).results;
				for (const { comment } of list) commentList.push(comment);
				if (commentList.length < total) return getCommentList(commentList);
				return commentList;
			};
			(async () => {
				const comments = await getCommentList();
				if (comments.length > 0) setState("manga", "commentList", comments);
			})();
		},
		catalog: async (_, { comicName, hiddenType, isMobile }) => {
			if (hiddenType) {
				const tip = helper.querySelector(".isBan, .wargin");
				if (tip) tip.style.textDecoration = "line-through";
				const titleDom = helper.querySelector("main .img+.title");
				if (titleDom) titleDom.textContent = "ComicRead 提示您：你訪問的內容暫不存在，請坐和放寬，等待目錄生成";
				try {
					await buildChapters(comicName, hiddenType);
				} catch (error) {
					helper.log.error(error);
					if (titleDom) titleDom.textContent = "ComicRead 提示您：目錄生成失敗😢";
					core.toast.error("目錄生成失敗😢", { duration: Infinity });
				}
			}
			if (!isMobile && token) handleLastChapter(comicName);
		}
	}
});
//#endregion
`,
	"site/ehentai": `\nlet solid_js_web = require("solid-js/web");
let components_Manga = require("components/Manga");
let core = require("core");
let helper = require("helper");
let solid_js = require("solid-js");
let solid_js_store = require("solid-js/store");
let components_Toast = require("components/Toast");
let request = require("request");
let userscript_multiSelect = require("userscript/multiSelect");
let userscript_detectAd = require("userscript/detectAd");
let userscript_ehTagRules = require("userscript/ehTagRules");
//#region src/site/ehentai/myTags.ts
const getTagSetHtml = async (tagset) => {
	const url = tagset ? \`/mytags?tagset=\${tagset}\` : "/mytags";
	const res = await core.request(url, { fetch: true });
	return helper.domParse(res.responseText);
};
const collectTags = (html, tagList = []) => {
	const defaultColor = html.querySelector("#tagcolor").value.slice(1) || "0";
	const [, ...tagEleList] = [...html.getElementById("usertags_outer").children];
	for (const e of tagEleList) {
		const id = Number(e.id.split("usertag_")[1]);
		const preview = e.querySelector(\`#tagpreview_\${id}\`);
		const { color: fontColor, borderColor } = preview.style;
		let [group, name] = preview.title.split(":");
		switch (group) {
			case "female":
			case "male":
			case "mixed": group = "gender";
		}
		const color = Number.parseInt(e.querySelector(\`#tagcolor_\${id}\`).value.slice(1) || defaultColor, 16);
		tagList.push({
			e,
			id,
			title: preview.title,
			color,
			fontColor,
			borderColor,
			group,
			name,
			weight: Number(e.querySelector("input[id^=tagweight_]").value),
			watch: e.querySelector(\`#tagwatch_\${id}\`).checked,
			hidden: e.querySelector(\`#taghide_\${id}\`).checked,
			order: -1
		});
	}
	return tagList;
};
const sortTagList = (tagList) => {
	const collator = new Intl.Collator();
	const sortFn = (a, b) => {
		if (a.color !== b.color) return b.color - a.color;
		if (a.group !== b.group) return collator.compare(a.group, b.group);
		if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
		if (a.watch !== b.watch) return a.watch ? -1 : 1;
		if (a.weight !== b.weight) return b.weight - a.weight;
		return collator.compare(a.name, b.name);
	};
	let i = -tagList.length;
	for (const tag of tagList.sort(sortFn)) tag.order = i++;
	return tagList;
};
const getMyTags = async () => {
	const tagSetList = [];
	const defaultTagSet = await getTagSetHtml();
	await Promise.all([...defaultTagSet.querySelectorAll("#tagset_outer select option")].map(async (option) => {
		const tagSet = option.selected ? defaultTagSet : await getTagSetHtml(option.value);
		if (tagSet.querySelector("#tagset_enable")?.checked) tagSetList.push(tagSet);
	}));
	const tagList = [];
	for (const html of tagSetList) collectTags(html, tagList);
	return sortTagList(tagList);
};
const handleMyTagsChange = /* @__PURE__ */ new Set();
const updateMyTags = async () => {
	const tagList = await getMyTags();
	for (const fn of handleMyTagsChange) await fn(tagList);
};
//#endregion
//#region src/site/ehentai/sortTags.ts
const updateSortCss = (tagList) => {
	let cssText = "tr a :is(.gltm, .glink + div:not([class])) { display: flex; }";
	for (const { title, order } of tagList) cssText += \`\\n.gt[title="\${title}"] { order: \${order}; }\`;
	return GM.setValue("ehTagSortCss", cssText);
};
/** 按照 mytags 上配置的标签顺序对其他页面上的标签进行排序 */
const sortTags = async (pageCtx) => {
	handleMyTagsChange.add(updateSortCss);
	switch (pageCtx.type) {
		case "p":
		case "l":
		case "t": return helper.css(await helper.ensureGmValue("ehTagSortCss", updateMyTags));
		case "mytags": {
			let style;
			const sortDom = (tagList) => {
				let cssText = \`
          #usertags_outer { display: flex; flex-direction: column; }
          #usertags_outer > div { margin: unset; }
          #usertag_0 { order: -\${tagList.length}; }\`;
				for (const { order, id } of tagList) cssText += \`\\n#usertag_\${id} { view-transition-name: _\${id}; order: \${order}; }\`;
				style ||= GM_addElement("style", { textContent: cssText });
				style.textContent = cssText;
			};
			handleMyTagsChange.add((tagList) => {
				if (!document.startViewTransition) return sortDom(tagList);
				document.startViewTransition(() => sortDom(tagList));
			});
		}
	}
};
//#endregion
//#region src/site/ehentai/colorizeTag.ts
const buildTagList = (tagList, prefix) => \`\\n\${Array.from(tagList, (tag) => \`\${prefix}\${CSS.escape(tag)}\`).join(",\\n")}\\n\`;
/** 获取最新的标签颜色数据 */
const updateTagColor = async (tagList) => {
	const backgroundMap = {};
	const borderMap = {};
	const colorMap = {};
	for (const tag of tagList) {
		const { color, borderColor, fontColor } = tag;
		const title = tag.title.replaceAll(" ", "_");
		(backgroundMap[color] ||= /* @__PURE__ */ new Set()).add(title);
		(borderMap[borderColor] ||= /* @__PURE__ */ new Set()).add(title);
		(colorMap[fontColor] ||= /* @__PURE__ */ new Set()).add(title);
	}
	let cssText = "";
	for (const [background, tags] of Object.entries(backgroundMap)) {
		cssText += \`:is(\${buildTagList(tags, "#td_")})\`;
		cssText += \`{ background: #\${Number(background).toString(16).padStart(6, "0")}; }\\n\\n\`;
	}
	for (const [border, tags] of Object.entries(borderMap)) {
		cssText += \`:is(\${buildTagList(tags, "#td_")}).gt\`;
		cssText += \`{ border-color: \${border}; }\\n\\n\`;
	}
	for (const [color, tags] of Object.entries(colorMap)) {
		cssText += \`:is(\${buildTagList(tags, "#td_")}):not(.gt)\`;
		cssText += \`{ border-color: \${color}; }\\n\\n\`;
		cssText += \`#taglist a:is(\${buildTagList(tags, "#ta_")})\`;
		cssText += \`{ color: \${color} !important; position: relative; }\\n\\n\`;
	}
	cssText += \`
    /* 禁用 eh 的变色效果，必须使用 !important */
    #taglist a[id] { color: var(--tag) !important; position: relative; }
    #taglist a[id]:hover { color: var(--tag-hover) !important; }

    #taglist a[id]::after {
      content: "";
      background: var(--color);
      width: 100%;
      position: absolute;
      left: 0;
      height: 2px;
      bottom: -7px;
    }
    .tup { --color: var(--tup) }
    .tdn { --color: var(--tdn) }
    #taglist a[id][style="color: blue;"] { --color: blue; }

    /* 避免被上一行的下划线碰到 */
    #taglist div:is(.gt, .gtl, .gtw) { margin-top: 1px; }
  \`;
	await GM.setValue("ehTagColorizeCss", cssText);
	return cssText;
};
/** 标签染色 */
const colorizeTag = async (_, pageCtx) => {
	handleMyTagsChange.add(updateTagColor);
	switch (pageCtx.type) {
		case "t":
		case "gallery": {
			let cssText = getComputedStyle(document.body).backgroundColor === "rgb(52, 53, 59)" ? "--tag: #DDDDDD; --tag-hover: #EEEEEE; --tup: #00E639; --tdn: #FF3333;" : "--tag: #5C0D11; --tag-hover: #8F4701; --tup: green; --tdn: red;";
			cssText = \`#taglist { \${cssText} }\\n\\n\`;
			cssText += await helper.ensureGmValue("ehTagColorizeCss", updateMyTags);
			helper.css(cssText);
			break;
		}
		case "mytags":
			helper.hijackFn("usertag_callback", helper.debounce(updateMyTags));
			await updateMyTags();
	}
	await sortTags(pageCtx);
};
//#endregion
//#region src/userscript/nhentaiApi.ts
const nhApi = (url, details) => core.request(url, {
	responseType: "json",
	headers: { "User-Agent": navigator.userAgent },
	fetch: false,
	...details
});
const getNhentaiData = async (id) => {
	const { response } = await nhApi(\`https://nhentai.net/api/v2/galleries/\${id}\`, {
		errorText: helper.t("site.ehentai.nhentai_error"),
		noTip: true
	});
	return response;
};
const searchNhentai = async (title) => {
	const { response } = await nhApi(\`https://nhentai.net/api/v2/search?query=\${encodeURIComponent(title)}\`, {
		errorText: helper.t("site.ehentai.nhentai_error"),
		noTip: true
	});
	return response.result;
};
const toImgList = (data) => data.pages.map((page) => ({
	src: \`https://i.nhentai.net/\${page.path}\`,
	width: page.width,
	height: page.height
}));
//#endregion
//#region src/site/ehentai/helper/context.tsx
const featureOptions = {
	/** 关联外站 */
	cross_site_link: true,
	/** 增加快捷键操作 */
	add_hotkeys_actions: true,
	/** 识别广告页 */
	detect_ad: true,
	/** 快捷收藏 */
	quick_favorite: true,
	/** 标签染色 */
	colorize_tag: true,
	/** 快捷评分 */
	quick_rating: true,
	/** 快捷查看标签定义 */
	quick_tag_define: true,
	/** 悬浮标签列表 */
	float_tag_list: true,
	/** 自动调整配置 */
	auto_adjust_option: false,
	/** 标签检查 */
	tag_lint: false,
	/** 展开标签列表 */
	expand_tag_list: true,
	autoShow: false,
	defaultOption: { imgRecognition: { enabled: true } }
};
const getPageContext = async () => {
	if (location.pathname === "/mytags") return { type: "mytags" };
	if (Reflect.has(unsafeWindow, "mpvkey")) return {
		type: "mpv",
		isManga: true
	};
	if (!Reflect.has(unsafeWindow, "display_comment_field")) {
		const type = (helper.querySelector("option[value=\\"t\\"]")?.parentElement)?.value;
		if (type) return { type };
		return;
	}
	let imgNum = 0;
	imgNum = Number(helper.querySelector(".gtb .gpc")?.textContent?.replaceAll(",", "").match(/\\d+/gu)?.at(-1));
	if (Number.isNaN(imgNum)) {
		const { responseText: html } = await core.request(location.href);
		imgNum = Number(/(?<=class="gdt2">)\\d+(?= pages<\\/td>)/u.exec(html)?.[0]);
	}
	return {
		type: "gallery",
		isManga: true,
		galleryId: location.pathname.split("/")[2],
		galleryTitle: helper.querySelector("#gn")?.textContent || void 0,
		japanTitle: helper.querySelector("#gj")?.textContent || void 0,
		imgNum,
		imagesPerPage: 0,
		imgList: helper.range(imgNum, ""),
		pageList: [],
		fileNameList: [],
		dom: {
			newTagField: helper.querySelector("#newtagfield"),
			sidebar: helper.querySelector("#gd5")
		}
	};
};
//#endregion
//#region src/site/ehentai/helper/LoadButton.tsx
var _tmpl$$7 = /*#__PURE__*/ solid_js_web.template(\`<a href=javascript:;>\`);
/** 放在原生右侧工具栏和标签选项里的漫画加载按钮 */
const LoadButton = (props) => {
	const tip = solid_js.createMemo(() => {
		const imgList = props.context.store.comicMap[props.id]?.imgList;
		if (imgList?.length === 0) return \` loading - 0/\${props.imgNum}\`;
		const progress = imgList?.filter(Boolean).length;
		switch (imgList?.length) {
			case void 0: return " Load comic";
			case progress: return " Read";
			default: return \` loading - \${progress}/\${props.imgNum}\`;
		}
	});
	return (() => {
		var _el$ = _tmpl$$7();
		_el$.$$click = (e) => {
			props.onClick?.(e);
			props.context.showComic(props.id);
		};
		solid_js_web.insert(_el$, tip);
		return _el$;
	})();
};
solid_js_web.delegateEvents(["click"]);
//#endregion
//#region src/site/ehentai/helper/index.ts
/** 获取所有标签 */
const getTaglist = () => {
	const lockTags = /* @__PURE__ */ new Set();
	const weakTags = /* @__PURE__ */ new Set();
	for (const tag of helper.querySelectorAll("#taglist table [id^=td_]")) {
		const [a] = tag.getElementsByTagName("a");
		if (a.classList.contains("tdn")) continue;
		if (a.classList.contains("tup") || tag.classList.contains("gt")) lockTags.add(tag.id.slice(3));
		else if (tag.classList.contains("gtl")) weakTags.add(tag.id.slice(3));
	}
	return [lockTags, weakTags];
};
const handleTagName = (tag) => {
	const [namespace, name] = tag.trim().split(":");
	if (!name) return ["", ""];
	return [namespace, name.replaceAll(/[^a-z-_ ]/giu, "")];
};
/** 命名空间缩写 */
const namespaceAbbr = [
	["artist", "a"],
	[
		"character",
		"c",
		"char"
	],
	[
		"cosplayer",
		"c",
		"os"
	],
	["female", "f"],
	[
		"group",
		"g",
		"circle"
	],
	[
		"language",
		"l",
		"lang"
	],
	["male", "m"],
	["mixed", "x"],
	["other", "o"],
	[
		"parody",
		"p",
		"series"
	],
	["reclass", "r"]
];
/** 获取标签的完整写法 */
const getTagNameFull = (tag) => {
	const [namespace, name] = handleTagName(tag);
	for (const target of namespaceAbbr) if (target.includes(namespace)) return \`\${target[0]}:\${name}\`;
	return tag;
};
/** 画廊分类图标对应的 class。在列表页是「.ct2」，在画廊里是「.gt2」 */
const categoriesMap = {
	Western: "ta",
	Misc: "t1",
	Doujinshi: "t2",
	Manga: "t3",
	"Artist CG": "t4",
	"Game CG": "t5",
	"Image Set": "t6",
	Cosplay: "t7",
	"Asian Porn": "t8",
	"Non-H": "t9"
};
/** 判断是否当前画廊是否是指定的分类 */
const isInCategories = (...name) => Boolean(helper.querySelector(\`#gdc > .cs:is(\${name.map((c) => \`.c\${categoriesMap[c]}\`).join(", ")})\`));
/** 更新 pagelist 里的 nl 参数 */
const setNl = (pageCtx, i, nl) => {
	const url = new URL(pageCtx.pageList[i]);
	url.searchParams.set("nl", nl);
	pageCtx.pageList[i] = url.href;
};
//#endregion
//#region src/site/ehentai/crossSiteLink.tsx
var _tmpl$$6 = /*#__PURE__*/ solid_js_web.template(\`<div style=opacity:1.0><a>\`);
var _tmpl$2$5 = /*#__PURE__*/ solid_js_web.template(\`<td>\`);
var _tmpl$3$3 = /*#__PURE__*/ solid_js_web.template(\`<tr><td class=tc>:\`);
var _tmpl$4$3 = /*#__PURE__*/ solid_js_web.template(\`<td class=tc style=text-align:left>\`);
var _tmpl$5$1 = /*#__PURE__*/ solid_js_web.template(\`<img src=https://ehgt.org/g/mr.gif class=mr alt=">">\`);
var _tmpl$6 = /*#__PURE__*/ solid_js_web.template(\`<a target=_blank>\`);
const nhentai = async ({ setState }, { galleryTitle, galleryId }) => {
	return (await searchNhentai(galleryTitle)).map(({ id, english_title, japanese_title, media_id }) => {
		const itemId = \`@nh:\${id}\`;
		setState("comicMap", itemId, { getImgList: async ({ dynamicLazyLoad }) => {
			const galleryData = await getNhentaiData(\`\${id}\`);
			const imgList = toImgList(galleryData);
			return dynamicLazyLoad({
				loadImg: async (i) => {
					const imgRes = await core.request(imgList[i].src, {
						headers: { Referer: \`https://nhentai.net/g/\${id}\` },
						responseType: "blob",
						fetch: false
					});
					return URL.createObjectURL(imgRes.response);
				},
				length: imgList.length,
				id: itemId
			});
		} });
		return {
			id: itemId,
			showText: \`\${id}\`,
			title: japanese_title || english_title,
			href: \`https://nhentai.net/g/\${id}\`,
			class: galleryId === media_id ? "gt" : "gtl"
		};
	}).toSorted((a, b) => (a.class === "gt" ? 0 : 1) - (b.class === "gt" ? 0 : 1) || Number(b.showText) - Number(a.showText));
};
nhentai.errorTip = (_, { galleryTitle }) => helper.t("site.ehentai.nhentai_failed", { nhentai: \`<a href='https://nhentai.net/search/?q=\${galleryTitle}' target="_blank"> <u> nhentai </u> </a>\` });
const hitomi = async ({ setState }, { galleryId }) => {
	const domain = "gold-usergeneratedcontent.net";
	const downImg = async (url) => {
		const imgRes = await core.request(url, {
			headers: { Referer: \`https://hitomi.la/reader/\${galleryId}.html\` },
			responseType: "blob",
			fetch: false
		});
		return URL.createObjectURL(imgRes.response);
	};
	const res = await core.request(\`https://ltn.\${domain}/galleries/\${galleryId}.js\`, {
		errorText: helper.t("site.ehentai.hitomi_error"),
		noTip: true,
		noCheckCode: true
	});
	switch (res.status) {
		case 404: return [];
		case 200: break;
		default: throw new Error(helper.t("site.ehentai.hitomi_error"));
	}
	const data = JSON.parse(res.responseText.slice(18));
	const itemId = \`@hitomi:\${data.id}\`;
	setState("comicMap", itemId, { getImgList: async ({ dynamicLazyLoad }) => {
		const { responseText: ggScript } = await core.request(\`https://ltn.\${domain}/gg.js?_=\${Date.now()}\`, {
			errorText: helper.t("site.ehentai.hitomi_error"),
			noTip: true
		});
		let gg = {};
		eval(ggScript);
		return dynamicLazyLoad({
			loadImg: async (i) => {
				const { hash, name } = data.files[i];
				const imageId = gg.s(hash);
				const m = /[\\da-f]{61}(?<hi>[\\da-f]{2})(?<lo>[\\da-f])/u.exec(hash).groups;
				const g = Number.parseInt(m.lo + m.hi, 16);
				const url = \`https://w\${gg.m(g) + 1}.\${domain}/\${gg.b}\${imageId}/\${hash}.webp\`;
				return {
					src: await downImg(url),
					name
				};
			},
			length: data.files.length,
			id: itemId,
			concurrency: 1
		});
	} });
	return [{
		id: itemId,
		showText: data.id,
		title: data.title,
		href: \`https://hitomi.la/galleries/\${data.id}\`,
		class: "gt"
	}];
};
hitomi.errorTip = () => helper.t("site.ehentai.hitomi_error");
/** 关联外站 */
const crossSiteLink = async (coreCtx, pageCtx) => {
	if (pageCtx.type !== "gallery") return;
	if (!pageCtx.galleryTitle) return core.toast.error(helper.t("site.ehentai.html_changed_link_failed"));
	const siteList = [];
	if (isInCategories("Doujinshi", "Manga", "Artist CG", "Game CG", "Image Set")) siteList.push(hitomi);
	if (isInCategories("Doujinshi", "Manga")) siteList.push(nhentai);
	if (siteList.length === 0) return;
	const [comicMap, setComicMap] = solid_js_store.createStore({});
	const ItemTag = (props) => (() => {
		var _el$ = _tmpl$$6(), _el$2 = _el$.firstChild;
		solid_js_web.effect((_p$) => {
			var _v$ = \`td_\${props.id}\`, _v$2 = props.class, _v$3 = props.title, _v$4 = props.id, _v$5 = props.href, _v$6 = \`return toggle_tagmenu(1, '\${props.id}',this)\`, _v$7 = props.title, _v$8 = props.showText;
			_v$ !== _p$.e && solid_js_web.setAttribute(_el$, "id", _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.className(_el$, _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$, "title", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$2, "id", _p$.o = _v$4);
			_v$5 !== _p$.i && solid_js_web.setAttribute(_el$2, "href", _p$.i = _v$5);
			_v$6 !== _p$.n && solid_js_web.setAttribute(_el$2, "onclick", _p$.n = _v$6);
			_v$7 !== _p$.s && solid_js_web.setAttribute(_el$2, "title", _p$.s = _v$7);
			_v$8 !== _p$.h && (_el$2.innerText = _p$.h = _v$8);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0,
			i: void 0,
			n: void 0,
			s: void 0,
			h: void 0
		});
		return _el$;
	})();
	const renderList = () => solid_js_web.render(() => solid_js_web.createComponent(solid_js.For, {
		get each() {
			return Object.entries(comicMap);
		},
		children: ([site, itemList]) => (() => {
			var _el$3 = _tmpl$3$3(), _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild;
			solid_js_web.setAttribute(_el$3, "id", \`\${site}_tagline\`);
			solid_js_web.insert(_el$4, site, _el$5);
			solid_js_web.insert(_el$3, solid_js_web.createComponent(solid_js.Show, {
				when: typeof itemList !== "string",
				get fallback() {
					return (() => {
						var _el$7 = _tmpl$4$3();
						_el$7.innerHTML = itemList;
						return _el$7;
					})();
				},
				get children() {
					var _el$6 = _tmpl$2$5();
					solid_js_web.insert(_el$6, solid_js_web.createComponent(solid_js.For, {
						each: itemList,
						children: ItemTag
					}));
					return _el$6;
				}
			}), null);
			return _el$3;
		})()
	}), helper.querySelector("#taglist tbody"));
	renderList();
	helper.hijackFn("tag_update_vote", () => {
		for (const e of helper.querySelectorAll("#nh_tagline")) e.remove();
		renderList();
	});
	const icon = () => _tmpl$5$1();
	const TagMenu = (props) => solid_js_web.createComponent(solid_js.For, {
		get each() {
			return props.children;
		},
		children: (item) => [icon(), item]
	});
	const tagmenu_act_dom = document.getElementById("tagmenu_act");
	let dispose;
	helper.hijackFn("_refresh_tagmenu_act", (rawFn, [a]) => {
		dispose?.();
		if (!a.id.startsWith("@")) return rawFn(a);
		if (tagmenu_act_dom.children.length > 0) tagmenu_act_dom.innerHTML = "";
		dispose = solid_js_web.render(() => solid_js_web.createComponent(TagMenu, { get children() {
			return [(() => {
				var _el$9 = _tmpl$6();
				_el$9.innerText = " Jump";
				solid_js_web.effect(() => solid_js_web.setAttribute(_el$9, "href", a.href));
				return _el$9;
			})(), solid_js_web.createComponent(LoadButton, {
				get id() {
					return a.id;
				},
				get imgNum() {
					return pageCtx.imgNum;
				},
				context: coreCtx
			})];
		} }), tagmenu_act_dom);
	});
	for (const getSiteComic of siteList) {
		setComicMap(getSiteComic.name, "searching...");
		try {
			const itemList = await getSiteComic(coreCtx, pageCtx);
			if (itemList.length > 0) setComicMap(getSiteComic.name, itemList);
			else setComicMap(getSiteComic.name, "null");
		} catch (error) {
			const errorTip = getSiteComic.errorTip(coreCtx, pageCtx);
			console.error(errorTip, error);
			setComicMap(getSiteComic.name, errorTip);
		}
	}
	const { adList } = coreCtx.store.comicMap[""];
	if (!adList) return;
	for (const itemList of Object.values(comicMap)) {
		if (typeof itemList === "string") continue;
		if (itemList.length === 1) coreCtx.setState("comicMap", itemList[0].id, { adList });
	}
};
//#endregion
//#region src/site/ehentai/expandTagList.tsx
/** 展开标签列表 */
const expandTagList = (_, pageCtx) => {
	if (pageCtx.type !== "t") return;
	helper.css\`
    #taglist {
      --scrollbar-slider: \${getComputedStyle(helper.querySelector(".ido")).backgroundColor};

      scrollbar-color: var(--scrollbar-slider) transparent;
      scrollbar-width: thin;

      height: auto;
      max-height: 230px;
      padding: 0 3px;

      &::-webkit-scrollbar {
        width: 5px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--scrollbar-slider);
      }

      /* 长标签换行 */
      & [id^='td_'] a[id^='ta_'] {
        text-wrap: balance;
        word-break: keep-all;
        overflow-wrap: anywhere;
      }
    }

    .gl1t {
      &[data-tag-list-loading],
      &[data-tag-list-loading] * {
        cursor: progress;
      }

      &[data-show-tag-list] .gl6t,
      &:not([data-show-tag-list]) #taglist {
        display: none;
      }
    }
  \`;
	const tagListMap = /* @__PURE__ */ new Map();
	const handleShow = async (item) => {
		if (item.style.cursor === "progress") return;
		if (!tagListMap.has(item)) {
			let html;
			let taglist = null;
			try {
				item.dataset.tagListLoading = "";
				const res = await core.request(item.querySelector("a").href, {
					noTip: true,
					errorText: "Fetch tag list error",
					noCheckCode: true
				});
				html = helper.domParse(res.responseText);
				taglist = html.querySelector("#taglist");
				if (!taglist) throw new Error("Fetch tag list error");
				const [, thumbnail] = html.querySelector("#gdt div[title][style]").style.background.split("\\"");
				new Image().src = thumbnail;
				for (const a of taglist.querySelectorAll("a")) a.target = "_blank";
			} catch {
				taglist = document.createElement("div");
				taglist.id = "taglist";
				taglist.textContent = html?.querySelector(".d p")?.textContent || "Fetch tag list error";
			}
			item.querySelector(".gl3t").after(taglist);
			tagListMap.set(item, taglist);
			Reflect.deleteProperty(item.dataset, "tagListLoading");
		}
		if (Reflect.has(item.dataset, "showTagList")) Reflect.deleteProperty(item.dataset, "showTagList");
		else item.dataset.showTagList = "";
	};
	for (const item of helper.querySelectorAll(".gl1t")) item.addEventListener("click", (e) => e.target.matches(":not(a):is(.gl1t, .gl6t, .gl6t *, #taglist, #taglist *)") && handleShow(item));
	components_Manga.setDefaultHotkeys((hotkeys) => ({
		...hotkeys,
		float_tag_list: ["q"]
	}));
	const [mouseXY, setMouseXY] = solid_js.createSignal([0, 0]);
	document.addEventListener("pointermove", (e) => setMouseXY([e.clientX, e.clientY]));
	components_Manga.listenHotkey({ float_tag_list: () => {
		for (const item of document.elementsFromPoint(...mouseXY())) if (item.matches(".gl1t")) return handleShow(item);
	} });
	colorizeTag(_, pageCtx);
};
//#endregion
//#region src/site/ehentai/floatTagList.tsx
const MdPictureInPicture = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M18 7h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1m3-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2m-1 16.01H4c-.55 0-1-.45-1-1V5.98c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.03c0 .55-.45 1-1 1"/></svg>\`;
const getDomPosition = (dom) => {
	const rect = dom.getBoundingClientRect();
	const computedStyle = getComputedStyle(dom);
	const leftBorder = parseFloat(computedStyle.borderLeftWidth);
	const leftPadding = parseFloat(computedStyle.paddingLeft);
	const topPadding = parseFloat(computedStyle.paddingTop);
	const topBorder = parseFloat(computedStyle.borderTopWidth);
	return {
		left: rect.left + leftBorder + leftPadding,
		top: rect.top + topBorder + topPadding,
		width: computedStyle.width,
		height: computedStyle.height
	};
};
const floatTagList = ({ store: coreStore }, pageCtx) => {
	if (pageCtx.type !== "gallery") return;
	const gd4 = helper.querySelector("#gd4");
	const gd4Style = getComputedStyle(gd4);
	/** 背景颜色 */
	let background = "rgba(0, 0, 0, 0)";
	let dom = gd4;
	while (background === "rgba(0, 0, 0, 0)") {
		background = getComputedStyle(dom).backgroundColor;
		dom = dom.parentElement;
	}
	const { borderColor } = getComputedStyle(helper.querySelector("#gdt"));
	/** 边框样式 */
	const border = \`1px solid \${borderColor}\`;
	helper.css\`
    #comicread-tag-box {
      position: fixed;
      z-index: 2147483647;

      font-size: 12px;
      text-align: justify;

      background: \${background};
      box-shadow: 0 0 15px -3px #0004;
    }

    #comicread-tag-box > #gd4 {
      margin: 0;
      padding: 0;
      border: none;
    }

    /* 确保始终显示在最上层，防止和其他脚本冲突 */
    #ehs-introduce-box {
      z-index: 1;
    }

    #comicread-tag-box > #ehs-introduce-box {
      position: relative;
      width: 161px;
      height: 100%;
      border-left: \${border};
    }

    #comicread-tag-box-placeholder {
      cursor: pointer;

      float: left;
      display: flex;
      grid-area: gd4;
      justify-content: center;

      margin: 0 0 0 10px;
      padding: 0 0 0 5px;
      border-right: 1px solid \${borderColor};
      border-left: 1px solid \${borderColor};
    }

    #comicread-tag-box-placeholder svg {
      width: 17em;
      opacity: 0.5;
    }

    /* 防止在窗口变小时确认按钮被挤出范围 */
    #tagmenu_new {
      width: fit-content;
    }
  \`;
	const { store, setState } = helper.useStore({
		open: false,
		top: 0,
		left: 0,
		opacity: 1,
		mouse: {
			x: 0,
			y: 0
		},
		bound: {
			width: 0,
			height: 0
		}
	});
	const setPos = (state, top, left) => {
		state.top = helper.clamp(-gd4.clientHeight * .75, top, state.bound.height);
		state.left = helper.clamp(-gd4.clientWidth * .75, left, state.bound.width);
	};
	const setOpacity = (opacity) => setState("opacity", helper.clamp(.5, opacity, 1));
	setOpacity(Number(localStorage.getItem("floatTagListOpacity")) || 1);
	document.addEventListener("pointermove", (e) => {
		setState((state) => {
			state.mouse.x = e.clientX;
			state.mouse.y = e.clientY;
		});
	});
	const hadnleResize = () => {
		setState((state) => {
			state.bound.width = window.innerWidth - gd4.clientWidth / 4;
			state.bound.height = window.innerHeight - gd4.clientHeight / 4;
			setPos(state, state.top, state.left);
		});
	};
	window.addEventListener("resize", hadnleResize);
	hadnleResize();
	helper.css("#comicread-tag-box", {
		display: () => store.open ? void 0 : "none",
		top: () => \`\${store.top}px\`,
		left: () => \`\${store.left}px\`,
		opacity: () => store.opacity
	});
	const placeholder = gd4.cloneNode();
	placeholder.id = "comicread-tag-box-placeholder";
	placeholder.style.display = "none";
	placeholder.addEventListener("click", () => setState("open", false));
	placeholder.innerHTML = MdPictureInPicture;
	gd4.before(placeholder);
	const ref = document.createElement("div");
	ref.id = "comicread-tag-box";
	ref.classList.add("comicread-ignore");
	document.body.append(ref);
	ref.addEventListener("wheel", (e) => {
		if (!e.shiftKey) return;
		e.stopPropagation();
		e.preventDefault();
		setOpacity(store.opacity + (e.deltaY > 0 ? -.05 : .05));
		localStorage.setItem("floatTagListOpacity", \`\${store.opacity}\`);
	}, { passive: false });
	const initPos = {
		top: 0,
		left: 0
	};
	helper.useDrag({
		ref: gd4,
		handleDrag({ type, xy: [x, y], initial: [ix, iy] }) {
			switch (type) {
				case "down":
					if (!store.open) {
						const pos = getDomPosition(gd4);
						setState((state) => {
							state.top = pos.top;
							state.left = pos.left;
						});
					}
					initPos.top = store.top;
					initPos.left = store.left;
					break;
				case "up":
					setState((state) => {
						if (coreStore.manga.show) return;
						const rect = placeholder.getBoundingClientRect();
						if (helper.approx(state.top, rect.top, 50) && helper.approx(state.left, rect.left, 50)) state.open = false;
					});
					break;
				case "move": setState((state) => {
					setPos(state, initPos.top + y - iy, initPos.left + x - ix);
					state.open = true;
				});
			}
		},
		handleClick: (_, target) => target.click(),
		skip: (e) => !e.target.matches("#gd4, #taglist, #gwrd, td+td, [id^=comidread] *:not(a)")
	});
	let ehs;
	let ehsParent;
	const handleEhs = () => {
		if (ehs) return;
		ehs = helper.querySelector("#ehs-introduce-box");
		if (!ehs) return;
		ehsParent = ehs.parentElement;
		const autoComplete = helper.querySelector(".eh-syringe-lite-auto-complete-list");
		if (autoComplete) {
			autoComplete.classList.add("comicread-ignore");
			autoComplete.style.zIndex = "2147483647";
			document.body.append(autoComplete);
		}
		helper.hijackFn("toggle_tagmenu", () => unsafeWindow.selected_tagname || helper.querySelector("#ehs-introduce-box .ehs-close")?.click());
	};
	helper.createEffectOn(() => store.open, (open) => {
		handleEhs();
		if (open) {
			const { height, width } = gd4Style;
			placeholder.style.cssText = \`height: \${height}; width: \${width};\`;
			ref.style.height = height;
			gd4.style.width = width;
			ref.append(gd4);
			if (ehs) ref.append(ehs);
			document.activeElement.blur();
		} else {
			placeholder.style.cssText = \`display: none;\`;
			gd4.style.width = "";
			placeholder.after(gd4);
			if (ehs) ehsParent.append(ehs);
			components_Manga.focus();
		}
	}, { defer: true });
	components_Manga.setDefaultHotkeys((hotkeys) => ({
		...hotkeys,
		float_tag_list: ["q"]
	}));
	core.registerEsc("关闭浮动标签栏", () => store.open ? setState("open", false) : "SKIP");
	components_Manga.listenHotkey({ float_tag_list: () => {
		setState((state) => {
			state.open = !state.open;
			if (!state.open) return;
			setPos(state, state.mouse.y - gd4.clientHeight / 2, state.mouse.x - gd4.clientWidth / 2);
		});
	} });
	helper.hijackFn("tag_from_field", (rawFn, args) => {
		if (store.open) document.activeElement.blur();
		return rawFn(...args);
	});
	const { newTagField } = pageCtx.dom;
	newTagField.addEventListener("pointerenter", () => store.open && newTagField.focus());
	/** 根据标签链接获取对应的标签名 */
	const getDropTag = (tagUrl) => {
		const tagDom = helper.querySelector(\`a[href=\${CSS.escape(tagUrl)}]\`);
		if (!tagDom) return;
		return tagDom.title || tagDom.id.slice(3).replaceAll("_", " ");
	};
	const handleDrop = (e) => {
		const text = e.dataTransfer.getData("text");
		const tag = getDropTag(text);
		if (!tag) return;
		e.preventDefault();
		if (!newTagField.value.includes(tag)) newTagField.value += \`\${tag}, \`;
		newTagField.dispatchEvent(new Event("input"));
	};
	newTagField.addEventListener("drop", handleDrop);
	const taglist = helper.querySelector("#taglist");
	taglist.addEventListener("dragover", (e) => e.preventDefault());
	taglist.addEventListener("dragenter", (e) => e.preventDefault());
	taglist.addEventListener("drop", handleDrop);
};
//#endregion
//#region src/site/ehentai/helper/api.ts
const ehApi = async (data, details) => {
	const res = await request.request(\`/api.php\`, {
		fetch: false,
		method: "POST",
		responseType: "json",
		cookie: document.cookie,
		data: JSON.stringify(data),
		...details
	});
	if (res.response.error) {
		helper.log.error(res.response.error);
		throw new Error(res.response.error);
	}
	return res.response;
};
/** 使用 api 获取图片链接 */
const getImgUrlByApi = async (pageCtx, i, nextLink) => {
	const imgPageUrl = pageCtx.pageList[i];
	const { imgkey, gid, page, nl } = /\\/s\\/(?<imgkey>\\S+)\\/(?<gid>\\d+)-(?<page>\\d+)(?=$|\\?nl=(?<nl>\\d+))/u.exec(imgPageUrl).groups;
	const data = {
		gid,
		page,
		imgkey
	};
	if (nl) data.nl = nl;
	if (pageCtx.mpvkey) {
		const res = await ehApi({
			method: "imagedispatch",
			...data,
			mpvkey: pageCtx.mpvkey
		}, { noTip: true });
		if (nextLink) setNl(pageCtx, i, res.s);
		return res.i;
	}
	const res = await ehApi({
		method: "showpage",
		...data,
		showkey: pageCtx.showkey
	}, { noTip: true });
	if (nextLink) setNl(pageCtx, i, /nl\\('(?<nl>\\d+-\\d+)'\\)/u.exec(res.i3).groups.nl);
	return /src="(?<src>\\S+)"/u.exec(res.i3).groups.src;
};
/** 检查 showkey */
const checkShowkey = async (pageCtx, imgPageUrl) => {
	if (pageCtx.showkey) return;
	const { responseText: html } = await request.request(imgPageUrl, { fetch: true }, 10);
	pageCtx.showkey = /showkey="(?<showkey>\\S+)"/u.exec(html).groups.showkey;
};
/** 检查 mpvkey */
const checkMpvKey = async (pageCtx) => {
	if (pageCtx.mpvkey) return;
	const mpvUrl = \`\${location.origin}\${location.pathname}\`.replace("/g/", "/mpv/");
	if (!helper.querySelector(\`.g2 a[href="\${mpvUrl}"]\`)) return;
	const { responseText: html } = await request.request(mpvUrl, { fetch: true });
	const mpvkey = /mpvkey = "(?<key>\\S+)"/u.exec(html)?.groups?.key;
	if (!mpvkey) return;
	pageCtx.mpvkey = mpvkey;
};
/** 检查 IP 是否被封禁 */
const checkIpBanned = (text) => text.includes("IP address has been temporarily banned") && components_Toast.toast.error(helper.t("site.ehentai.ip_banned"), {
	throw: true,
	duration: Infinity
});
/** 从图片页获取图片地址 */
const getImgUrl = async (pageCtx, i) => {
	try {
		return await getImgUrlByApi(pageCtx, i);
	} catch (error) {
		helper.log.warn("getImgUrlByApi failed", error);
	}
	const res = await request.request(pageCtx.pageList[i], {
		fetch: true,
		errorText: helper.t("site.ehentai.fetch_img_page_source_failed")
	}, 10);
	checkIpBanned(res.responseText);
	try {
		return /id="img" src="(?<src>.+?)"/u.exec(res.responseText).groups.src;
	} catch {
		throw new Error(helper.t("site.ehentai.fetch_img_url_failed"));
	}
};
/** 从详情页获取图片页的地址 */
const getImgPageUrl = async (pageNum = 0) => {
	const res = await request.request(\`\${location.pathname}\${pageNum ? \`?p=\${pageNum}\` : ""}\`, {
		fetch: true,
		errorText: helper.t("site.ehentai.fetch_img_page_url_failed")
	});
	checkIpBanned(res.responseText);
	const pageList = [...res.responseText.matchAll(/<a href="(?<url>.{20,50})"><(?<img>img alt=.+?|div><div |div )title=".+?: (?<fileName>.+?)"/gu)].map(({ groups: { url, fileName } }) => [url, fileName]);
	if (pageList.length === 0) throw new Error(helper.t("site.ehentai.fetch_img_page_url_failed"));
	return pageList;
};
/** 获取新的图片页地址 */
const updatePageUrl = async (pageCtx, i) => {
	try {
		return await getImgUrlByApi(pageCtx, i, true);
	} catch {}
	const res = await request.request(pageCtx.pageList[i], { errorText: helper.t("site.ehentai.fetch_img_page_source_failed") });
	checkIpBanned(res.responseText);
	const nl = /nl\\('(?<nl>.+?)'\\)/u.exec(res.responseText)?.groups?.nl;
	if (!nl) throw new Error(helper.t("site.ehentai.fetch_img_url_failed"));
	setNl(pageCtx, i, nl);
};
/** 按需加载第 i 张图所在分页的详情页 URL */
const ensureImgPageUrl = async (pageCtx, index) => {
	if (pageCtx.pageList[index]) return;
	const pageNum = Math.floor(index / pageCtx.imagesPerPage) || 0;
	const pageList = await getImgPageUrl(pageNum);
	pageCtx.imagesPerPage ||= pageList.length;
	const startIndex = pageNum * pageCtx.imagesPerPage;
	for (let i = 0; i < pageList.length; i++) [pageCtx.pageList[startIndex + i], pageCtx.fileNameList[startIndex + i]] = pageList[i];
};
//#endregion
//#region src/site/ehentai/hotkeys.ts
const addHotkeysActions = (_, pageCtx) => {
	if (pageCtx.type !== "gallery") return components_Manga.listenHotkey({
		scroll_right: () => helper.querySelector("#unext")?.click(),
		scroll_left: () => helper.querySelector("#uprev")?.click()
	});
	core.registerEsc("取消选中当前标签", () => unsafeWindow.selected_tagname ? unsafeWindow.toggle_tagmenu() : "SKIP");
	return components_Manga.listenHotkey({
		ArrowUp: () => unsafeWindow.selected_tagid && unsafeWindow?.tag_vote_up(),
		ArrowDown: () => unsafeWindow.selected_tagid && unsafeWindow?.tag_vote_down(),
		scroll_right: () => helper.querySelector(".ptt td:last-child:not(.ptdd)")?.click(),
		scroll_left: () => helper.querySelector(".ptt td:first-child:not(.ptdd)")?.click()
	});
};
//#endregion
//#region src/site/ehentai/detectAd.ts
const imageBitmapCache = /* @__PURE__ */ new Map();
const loadImageBitmap = async (url) => {
	if (imageBitmapCache.has(url)) return imageBitmapCache.get(url);
	const imageBitmap = await createImageBitmap(await request.downloadImg(url));
	imageBitmapCache.set(url, imageBitmap);
	return imageBitmap;
};
/** 从雪碧图中切割指定区域的图片 */
const extractSpriteImage = async (style) => {
	const { width, height, backgroundImage, backgroundPositionX: backgroundX, backgroundPositionY: backgroundY } = style;
	const urlMatch = /url\\(['"](?<url>[^)]+)['"]\\)/u.exec(backgroundImage)?.groups;
	if (!urlMatch) throw new Error("解析不到背景图片URL");
	const { url } = urlMatch;
	const spriteImage = await loadImageBitmap(url);
	const w = parseFloat(width);
	const h = parseFloat(height);
	const canvas = new OffscreenCanvas(w, h);
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, w, h);
	const sourceX = -parseFloat(backgroundX);
	const sourceY = -parseFloat(backgroundY);
	ctx.drawImage(spriteImage, sourceX, sourceY, w, h, 0, 0, w, h);
	return canvas.transferToImageBitmap();
};
/** 识别广告 */
const detectAd = ({ store, setState, options }, { imgList, pageList, fileNameList }) => {
	if (!(options.detect_ad && document.getElementById("ta_other:extraneous_ads"))) return;
	setState("comicMap", "", "adList", new helper.ReactiveSet());
	/** 缩略图列表 */
	const thumbnailList = [];
	(async () => {
		for (const e of helper.querySelectorAll("#gdt > a")) {
			const index = Number(/.+-(?<index>\\d+)/u.exec(e.href)?.groups?.index) - 1;
			if (Number.isNaN(index)) continue;
			pageList[index] = e.href;
			const thumbnail = e.querySelector("[title]");
			[, fileNameList[index]] = thumbnail.title.split(/：|: /u);
			if (helper.isImageElement(thumbnail)) thumbnailList[index] = thumbnail;
			if (thumbnail.style.background.includes("url(")) thumbnailList[index] = await extractSpriteImage(thumbnail.style);
		}
		await userscript_detectAd.getAdPageByFileName(fileNameList, store.comicMap[""].adList);
		if (store.comicMap[""].adList.size === 0) await userscript_detectAd.getAdPageByContent(thumbnailList, store.comicMap[""].adList);
	})();
	helper.css(helper.createRootMemo(() => {
		if (!store.comicMap[""]?.adList?.size) return "";
		return [...store.comicMap[""].adList].map((i) => \`a[href="\${pageList[i]}"] [title]:not(:hover) {
              filter: blur(8px);
              clip-path: border-box;
              backdrop-filter: blur(8px);
            }\`).join("\\n");
	}));
	return {
		checkFileName: helper.once(() => userscript_detectAd.getAdPageByFileName(fileNameList, store.comicMap[""].adList)),
		checkContent: helper.once(() => userscript_detectAd.getAdPageByContent(imgList, store.comicMap[""].adList))
	};
};
//#endregion
//#region src/site/ehentai/multiSelectLoad.tsx
const multiSelectLoad = async (coreCtx, pageCtx) => {
	const { setState, showComic } = coreCtx;
	helper.css\`
    #gdt > a [title] {
      position: relative;
    }
  \`;
	const checkAd = detectAd(coreCtx, pageCtx);
	setState("manga", { onLoading: (_, img) => {
		if (!img) return;
		const index = pageCtx.imgList.indexOf(img.src);
		const { length } = pageCtx.imgList;
		if (helper.inRange(length - 10, index, length)) checkAd?.checkContent();
	} });
	const ensureSetup = helper.singleThreaded(async () => {
		await ensureImgPageUrl(pageCtx, 0);
		checkAd?.checkFileName();
		try {
			await checkMpvKey(pageCtx);
			await checkShowkey(pageCtx, pageCtx.pageList[0]);
		} catch (error) {
			helper.log.warn("checkKey failed", error);
		}
	});
	await (await userscript_multiSelect.useMultiSelectLoad(coreCtx, {
		id: pageCtx.galleryId,
		allItemIds: () => helper.range(pageCtx.imgNum).map(String),
		getImgList: async (id) => {
			await ensureSetup();
			const i = Number(id);
			await ensureImgPageUrl(pageCtx, i);
			pageCtx.imgList[i] ||= await getImgUrl(pageCtx, i);
			return [{
				src: pageCtx.imgList[i],
				name: pageCtx.fileNameList[i]
			}];
		}
	})).registerItems(pageCtx.galleryId, (map) => {
		for (const dom of helper.querySelectorAll("#gdt a")) {
			const imgIndex = Number(/(?<=-)\\d+(?:\\?|$)/u.exec(dom.href)?.[0]) - 1;
			if (!Number.isNaN(imgIndex)) map.set(dom.querySelector("[title]"), String(imgIndex));
		}
	});
	return { handleClick: async (e) => {
		if (!e.shiftKey) return;
		e.stopPropagation();
		const defaultText = coreCtx.multiSelect ? helper.descRange(coreCtx.multiSelect.selectedIds().map(Number), pageCtx.imgNum) : "";
		const pageRange = prompt(helper.t("other.page_range"), defaultText);
		if (!pageRange) return;
		coreCtx.multiSelect?.setSelectedIds([...helper.extractRange(pageRange, pageCtx.imgNum)].map(String));
		setState("comicMap", "", "imgList", void 0);
		await showComic("");
	} };
};
//#endregion
//#region src/site/ehentai/quickFavorite.tsx
var _tmpl$$5 = /*#__PURE__*/ solid_js_web.template(\`<div>\`);
var _tmpl$2$4 = /*#__PURE__*/ solid_js_web.template(\`<div class=comidread-favorites-item><input type=radio>\`);
var _tmpl$3$2 = /*#__PURE__*/ solid_js_web.template(\`<span class=comidread-favorites>\`);
var _tmpl$4$2 = /*#__PURE__*/ solid_js_web.template(\`<h3>loading...\`);
const style = \`
  .comidread-favorites {
    position: absolute;
    z-index: 75;
    left: 0;

    overflow: auto;
    align-content: center;

    box-sizing: border-box;
    width: 100%;
    padding-left: 0.6em;

    border: none;
    border-radius: 0;
  }

  .comidread-favorites-item {
    cursor: pointer;

    display: flex;
    align-items: center;

    width: 100%;
    margin: 1em 0;

    text-align: left;
    overflow-wrap: anywhere;
  }

  .comidread-favorites-item > input {
    pointer-events: none;
    margin: 0 0.5em 0 0;
  }

  .comidread-favorites-item > div {
    flex-shrink: 0;

    width: 15px;
    height: 15px;
    margin: 0 0.5em 0 0;

    background-image: url("https://ehgt.org/g/fav.png");
    background-repeat: no-repeat;
  }

  .gl1t > .comidread-favorites {
    padding: 1em 1.5em;
  }

  .comidread-blink {
    animation: comidread-blink 1.2s ease-in-out infinite;
  }

  @keyframes comidread-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
\`;
const addQuickFavorite = ({ button: favoriteButton, root, apiUrl, height, top = 0 }) => {
	root.style.position = "relative";
	const [show, setShow] = solid_js.createSignal(false);
	const [favorites, setFavorites] = solid_js.createSignal([]);
	const [favnote, setFavnote] = solid_js.createSignal("");
	const updateFavorite = async () => {
		try {
			const res = await core.request(apiUrl, { errorText: helper.t("site.ehentai.fetch_favorite_failed") });
			const dom = helper.domParse(res.responseText);
			const list = [...dom.querySelectorAll(".nosel > div")];
			if (list.length === 10) list[0].querySelector("input").checked = false;
			setFavnote(dom.querySelector("#galpop textarea[name=\\"favnote\\"]")?.value ?? "");
			setFavorites(list);
		} catch {
			core.toast.error(helper.t("site.ehentai.fetch_favorite_failed"));
			setFavorites([]);
		}
	};
	let hasRender = false;
	const renderDom = () => {
		if (hasRender) return;
		hasRender = true;
		const FavoriteItem = (e, index) => {
			const { checked } = e.querySelector("input");
			const handleClick = async () => {
				if (checked) return;
				setShow(false);
				const formData = new FormData();
				formData.append("favcat", index() === 10 ? "favdel" : \`\${index()}\`);
				formData.append("apply", "Apply Changes");
				formData.append("favnote", favnote());
				formData.append("update", "1");
				favoriteButton.classList.add("comidread-blink");
				const res = await core.request(apiUrl, {
					method: "POST",
					data: formData,
					errorText: helper.t("site.ehentai.change_favorite_failed")
				}).finally(() => favoriteButton.classList.remove("comidread-blink"));
				core.toast.success(helper.t("site.ehentai.change_favorite_success"));
				const updateCode = /\\nif\\(window.opener.document.+\\n/u.exec(res.responseText)?.[0]?.replaceAll("window.opener.document", "window.document");
				if (updateCode) eval(updateCode);
				await updateFavorite();
			};
			return (() => {
				var _el$ = _tmpl$2$4(), _el$2 = _el$.firstChild;
				_el$.$$click = handleClick;
				_el$2.checked = checked;
				solid_js_web.insert(_el$, solid_js_web.createComponent(solid_js.Show, {
					get when() {
						return index() <= 9;
					},
					get children() {
						var _el$3 = _tmpl$$5();
						solid_js_web.effect((_$p) => solid_js_web.setStyleProperty(_el$3, "background-position", \`0px -\${2 + 19 * index()}px\`));
						return _el$3;
					}
				}), null);
				solid_js_web.insert(_el$, () => e.textContent?.trim(), null);
				return _el$;
			})();
		};
		let background = "rgba(0, 0, 0, 0)";
		let dom = root;
		while (background === "rgba(0, 0, 0, 0)") {
			background = getComputedStyle(dom).backgroundColor;
			dom = dom.parentElement;
		}
		solid_js_web.render(() => solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return show();
			},
			get children() {
				var _el$4 = _tmpl$3$2();
				solid_js_web.setStyleProperty(_el$4, "background", background);
				solid_js_web.setStyleProperty(_el$4, "height", \`\${height}px\`);
				solid_js_web.setStyleProperty(_el$4, "top", \`\${top}px\`);
				solid_js_web.insert(_el$4, solid_js_web.createComponent(solid_js.For, {
					get each() {
						return favorites();
					},
					children: FavoriteItem,
					get fallback() {
						return _tmpl$4$2();
					}
				}));
				return _el$4;
			}
		}), root);
	};
	const rawClick = favoriteButton.onclick;
	favoriteButton.onclick = null;
	favoriteButton.addEventListener("mousedown", async (e) => {
		if (e.buttons !== 1 && e.buttons !== 4) return;
		e.stopPropagation();
		e.preventDefault();
		if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || e.buttons === 4) return rawClick.call(favoriteButton, e);
		renderDom();
		setShow((val) => !val);
		if (show()) await updateFavorite();
	});
};
/** 快捷收藏 */
const quickFavorite = (_, pageCtx) => {
	if (unsafeWindow.apiuid === -1) return;
	switch (pageCtx.type) {
		case "gallery":
			helper.css(style);
			addQuickFavorite({
				root: helper.querySelector("#gd3"),
				button: helper.querySelector("#gdf"),
				apiUrl: \`\${unsafeWindow.popbase}addfav\`,
				height: helper.querySelector("#gdf").firstElementChild.offsetTop
			});
			break;
		case "t":
			helper.css(style);
			for (const item of helper.querySelectorAll(".gl1t")) {
				const button = item.querySelector("[id^=posted_]");
				const top = item.firstElementChild.getBoundingClientRect().bottom - item.getBoundingClientRect().top;
				const bottom = item.lastElementChild.getBoundingClientRect().top - item.getBoundingClientRect().top;
				const [apiUrl] = /http.+?(?=')/u.exec(button.getAttribute("onclick"));
				addQuickFavorite({
					root: item,
					top,
					height: bottom - top,
					button,
					apiUrl
				});
			}
			break;
		case "e":
			helper.css(style);
			for (const item of helper.querySelectorAll(".gl1e")) {
				const button = item.nextElementSibling.querySelector("[id^=posted_]");
				const height = Number.parseInt(getComputedStyle(item).height, 10);
				const [apiUrl] = /http.+?(?=')/u.exec(button.getAttribute("onclick"));
				addQuickFavorite({
					root: item,
					button,
					height,
					apiUrl
				});
			}
	}
};
solid_js_web.delegateEvents(["click"]);
//#endregion
//#region src/site/ehentai/quickRating.tsx
var _tmpl$$4 = /*#__PURE__*/ solid_js_web.template(\`<span class=comidread-quick-rating><img src=https://ehgt.org/g/blank.gif><map>\`);
var _tmpl$2$3 = /*#__PURE__*/ solid_js_web.template(\`<area shape=rect>\`);
/** 快捷评分 */
const quickRating = (_, pageCtx) => {
	let list;
	switch (pageCtx.type) {
		case "e":
			list = helper.querySelectorAll("#favform > table > tbody > tr");
			break;
		case "m":
		case "p":
		case "l":
			list = helper.querySelectorAll("#favform > table > tbody > tr").slice(1);
			break;
		case "t":
			list = helper.querySelectorAll(".gl1t");
			break;
		default: return;
	}
	helper.css\`
    .comidread-quick-rating {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .comidread-blink {
      animation: comidread-blink 1.2s ease-in-out infinite;
    }

    @keyframes comidread-blink {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.25;
      }
    }
  \`;
	const coordsList = [
		"0,0,7,16",
		"8,0,15,16",
		"16,0,23,16",
		"24,0,31,16",
		"32,0,39,16",
		"40,0,47,16",
		"48,0,55,16",
		"56,0,63,16",
		"64,0,71,16",
		"72,0,79,16"
	];
	/** 修改评分 */
	const editRating = async (url, num) => {
		try {
			const dataRes = await core.request(url, {
				errorText: helper.t("site.ehentai.change_rating_failed"),
				noTip: true
			});
			const match = /api_url = "(?<api_url>.+?)";.+?gid = (?<gid>\\d+);.+?token = "(?<token>.+?)";.+?apiuid = (?<apiuid>\\d+);.+?apikey = "(?<apikey>.+?)"/su.exec(dataRes.responseText)?.groups;
			if (!match) throw new Error(helper.t("site.ehentai.change_rating_failed"));
			const { api_url, gid, token, apiuid, apikey } = match;
			const res = await core.request(api_url, {
				method: "POST",
				responseType: "json",
				data: JSON.stringify({
					method: "rategallery",
					rating: \`\${num}\`,
					apikey,
					apiuid,
					gid,
					token
				}),
				fetch: true,
				noTip: true
			});
			core.toast.success(\`\${helper.t("site.ehentai.change_rating_success")}: \${res.response.rating_usr}\`);
			return res.response;
		} catch {
			core.toast.error(helper.t("site.ehentai.change_rating_failed"));
			throw new Error(helper.t("site.ehentai.change_rating_failed"));
		}
	};
	/** 根据评分修改显示效果 */
	const updateRatingImage = (dom, num) => {
		let a = Math.round(num + 1);
		const b = -80 + 16 * Math.ceil(a / 2);
		a = a % 2 === 1 ? -21 : -1;
		dom.style.backgroundPosition = \`\${b}px \${a}px\`;
	};
	const renderQuickRating = (item, ir, index) => {
		let basePosition = ir.style.backgroundPosition;
		let isRequesting = false;
		solid_js_web.render(() => (() => {
			var _el$ = _tmpl$$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
			_el$.$$mouseout = () => {
				ir.style.backgroundPosition = basePosition;
			};
			solid_js_web.setAttribute(_el$, "data-index", index);
			solid_js_web.setAttribute(_el$2, "usemap", \`#rating-\${index}\`);
			solid_js_web.setAttribute(_el$3, "name", \`rating-\${index}\`);
			solid_js_web.insert(_el$3, solid_js_web.createComponent(solid_js.For, {
				each: coordsList,
				children: (coords, i) => (() => {
					var _el$4 = _tmpl$2$3();
					_el$4.$$click = async () => {
						if (isRequesting) return;
						isRequesting = true;
						ir.classList.add("comidread-blink");
						try {
							const res = await editRating(item.querySelector("a").href, i() + 1);
							ir.className = res.rating_cls;
							updateRatingImage(ir, res.rating_usr * 2 - 1);
							basePosition = ir.style.backgroundPosition;
						} catch {
							ir.style.backgroundPosition = basePosition;
						} finally {
							isRequesting = false;
							ir.classList.remove("comidread-blink");
						}
					};
					_el$4.$$mouseover = () => updateRatingImage(ir, i());
					solid_js_web.setAttribute(_el$4, "coords", coords);
					return _el$4;
				})()
			}));
			return _el$;
		})(), ir);
	};
	for (const [index, item] of list.entries()) {
		const ir = [...item.querySelectorAll(".ir")].at(-1);
		if (!ir) continue;
		ir.addEventListener("mouseenter", () => renderQuickRating(item, ir, index), { once: true });
	}
};
solid_js_web.delegateEvents([
	"mouseout",
	"mouseover",
	"click"
]);
//#endregion
//#region node_modules/.pnpm/@material-design-icons+svg@0.14.15/node_modules/@material-design-icons/svg/round/launch.svg
var _tmpl$$3 = /*#__PURE__*/ solid_js_web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1M14 4c0 .55.45 1 1 1h2.59l-9.13 9.13a.996.996 0 1 0 1.41 1.41L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V3h-6c-.55 0-1 .45-1 1">\`);
var launch_default = (props = {}) => (() => {
	var _el$ = _tmpl$$3();
	solid_js_web.spread(_el$, props, true, true);
	return _el$;
})();
//#endregion
//#region src/site/ehentai/quickTagDefine.tsx
var _tmpl$$2 = /*#__PURE__*/ solid_js_web.template(\`<h3>\`);
var _tmpl$2$2 = /*#__PURE__*/ solid_js_web.template(\`<h1><a target=_blank>\`);
var _tmpl$3$1 = /*#__PURE__*/ solid_js_web.template(\`<span id=comidread-tag-define>\`);
var _tmpl$4$1 = /*#__PURE__*/ solid_js_web.template(\`<h3>loading...\`);
/** 快捷查看标签定义 */
const quickTagDefine = (_, pageCtx) => {
	if (pageCtx.type !== "gallery") return;
	const tagContent = solid_js_store.createMutable({});
	const saveTagContent = async (tag) => {
		if (Reflect.has(tagContent, tag)) return;
		const url = \`https://ehwiki.org/wiki/\${tag.replaceAll(/[a-z]+:\\s?/giu, "")}\`;
		const res = await core.request(url, { noCheckCode: true });
		if (res.status !== 200) {
			tagContent[tag] = (() => {
				var _el$ = _tmpl$$2();
				solid_js_web.insert(_el$, () => \`\${res.status} - \${res.statusText}\`);
				return _el$;
			})();
			return;
		}
		const content = helper.domParse(res.responseText).querySelector("#mw-content-text");
		for (const dom of content.querySelectorAll("img[src^=\\"/\\"]")) dom.setAttribute("src", \`https://ehwiki.org\${dom.getAttribute("src")}\`);
		for (const dom of content.getElementsByTagName("a")) {
			const href = dom.getAttribute("href") ?? "";
			if (href.startsWith("/")) dom.setAttribute("href", \`https://ehwiki.org\${href}\`);
			dom.target = "_blank";
		}
		for (const dom of content.querySelectorAll(".thumb")) dom.remove();
		tagContent[tag] = [(() => {
			var _el$2 = _tmpl$2$2(), _el$3 = _el$2.firstChild;
			solid_js_web.setAttribute(_el$3, "href", url);
			solid_js_web.insert(_el$3, tag, null);
			solid_js_web.insert(_el$3, solid_js_web.createComponent(launch_default, {}), null);
			return _el$2;
		})(), content];
	};
	helper.css\`
    #comidread-tag-define {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;

      box-sizing: border-box;
      width: 100%;
      padding: 0 1em;

      text-align: start;
    }

    #taglist {
      position: relative;
    }

    #comidread-tag-define h1 {
      margin: 0.4em 0;
      border-bottom: 1px solid #a2a9b1;
    }

    #comidread-tag-define h1 svg {
      height: 0.7em;
      margin-left: 0.2em;
    }

    #comidread-tag-define ul {
      margin: 0.3em 0 0 1.6em;
      padding: 0;
    }

    #comidread-tag-define li {
      margin-bottom: 0.2em;
    }

    #comidread-tag-define div a {
      text-decoration: underline;
    }

    #comidread-tag-define dd {
      margin-left: 1.6em;
    }

    #comidread-tag-define dl {
      margin-top: 0.2em;
      margin-bottom: 0.5em;
    }
  \`;
	const [show, setShow] = solid_js.createSignal(false);
	const root = helper.querySelector("#taglist");
	let background = "rgba(0, 0, 0, 0)";
	let dom = root;
	while (background === "rgba(0, 0, 0, 0)") {
		background = getComputedStyle(dom).backgroundColor;
		dom = dom.parentElement;
	}
	solid_js_web.render(() => solid_js_web.createComponent(solid_js.Show, {
		get when() {
			return show();
		},
		get children() {
			var _el$4 = _tmpl$3$1();
			solid_js_web.setStyleProperty(_el$4, "background", background);
			solid_js_web.insert(_el$4, () => tagContent[unsafeWindow.selected_tagname] ?? _tmpl$4$1());
			solid_js_web.effect((_$p) => solid_js_web.setStyleProperty(_el$4, "height", \`\${root.scrollHeight}px\`));
			return _el$4;
		}
	}), root);
	unsafeWindow.tag_define = async () => {
		if (!unsafeWindow.selected_tagname) return;
		if (show()) return setShow(false);
		setShow(true);
		try {
			await saveTagContent(unsafeWindow.selected_tagname);
		} catch (error) {
			console.error(error);
			setShow(false);
		}
	};
	helper.hijackFn("toggle_tagmenu", () => setShow(false));
	core.registerEsc("关闭显示标签定义", () => show() ? setShow(false) : "SKIP");
};
//#endregion
//#region src/site/ehentai/sidebarOverflow.ts
/** 处理侧边栏溢出 */
const sidebarOverflow = (_, pageCtx) => {
	if (pageCtx.type !== "gallery") return;
	const { sidebar } = pageCtx.dom;
	new ResizeObserver(() => {
		Reflect.deleteProperty(sidebar.dataset, "long");
		const lastNode = helper.querySelector("#gd5 p:last-of-type");
		if (lastNode.offsetTop + lastNode.offsetHeight > 352) sidebar.dataset.long = "";
	}).observe(sidebar);
	helper.css\`
    #gd5[data-long] {
      --scrollbar-slider: \${getComputedStyle(helper.querySelector(".gm")).borderColor};

      scrollbar-color: var(--scrollbar-slider) transparent;
      scrollbar-width: thin;
      overflow: auto;
      max-height: 352px;

      &::-webkit-scrollbar {
        width: 5px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--scrollbar-slider);
      }
    }

    /* 在显示 ehs 时隐藏 gd5 上的滚动条，避免同时显示两个滚动条 */
    #gd5[data-long]:has(#ehs-introduce-box .ehs-content) {
      overflow: hidden;
    }

    #gmid #ehs-introduce-box {
      width: 100%;
    }

    /*
      消除 ehs 针对按钮太多时的解决办法，用脚本的处理方式就好了，避免在浮动标签栏时导致滚动
      https://github.com/EhTagTranslation/EhSyringe/commit/009054cc34ee818972d2a042990bf89bdff1895a
    */
    body #gmid #gd5 {
      --ehs-gap: 1;

      justify-content: unset;
    }
  \`;
};
//#endregion
//#region src/site/ehentai/tagLint.tsx
var _tmpl$$1 = /*#__PURE__*/ solid_js_web.template(\`<div><a>\`);
var _tmpl$2$1 = /*#__PURE__*/ solid_js_web.template(\`<span>「<!>」\`);
var _tmpl$3 = /*#__PURE__*/ solid_js_web.template(\`<li>\`);
var _tmpl$4 = /*#__PURE__*/ solid_js_web.template(\`<hr>\`);
var _tmpl$5 = /*#__PURE__*/ solid_js_web.template(\`<ul>\`);
const tagLint = (_, pageCtx) => {
	if (pageCtx.type !== "gallery") return;
	/** 是否是「Doujinshi」「Manga」「Non-H」 */
	const isManga = isInCategories("Doujinshi", "Manga", "Non-H");
	const lintRules = userscript_ehTagRules.getTagLintRules();
	const [warnList, setWarnList] = solid_js.createSignal({});
	helper.css\`
    #comidread-tag-lint [id^='td_'] {
      float: none;
      display: inline-block;
    }
  \`;
	const getTagClass = (tag, weak) => {
		if (weak === void 0) return document.getElementById(\`td_\${tag}\`)?.className;
		return weak ? "gtl" : "gt";
	};
	const TagBase = (props) => (() => {
		var _el$ = _tmpl$$1(), _el$2 = _el$.firstChild;
		_el$2.$$click = (e) => e.preventDefault();
		solid_js_web.insert(_el$2, () => props.name);
		solid_js_web.effect((_p$) => {
			var _v$ = \`td_\${props.name}\`, _v$2 = getTagClass(props.name, props.weak), _v$3 = \`ta_\${props.name}\`, _v$4 = \`https://exhentai.org/tag/\${props.name.replaceAll("_", "+")}\`;
			_v$ !== _p$.e && solid_js_web.setAttribute(_el$, "id", _p$.e = _v$);
			_v$2 !== _p$.t && solid_js_web.className(_el$, _p$.t = _v$2);
			_v$3 !== _p$.a && solid_js_web.setAttribute(_el$2, "id", _p$.a = _v$3);
			_v$4 !== _p$.o && solid_js_web.setAttribute(_el$2, "href", _p$.o = _v$4);
			return _p$;
		}, {
			e: void 0,
			t: void 0,
			a: void 0,
			o: void 0
		});
		return _el$;
	})();
	const Tag = (props) => {
		const tags = userscript_ehTagRules.splitTagNamespace(props.name);
		return solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return tags.length > 1;
			},
			get fallback() {
				return TagBase(props);
			},
			get children() {
				var _el$3 = _tmpl$2$1(), _el$6 = _el$3.firstChild.nextSibling;
				_el$6.nextSibling;
				solid_js_web.insert(_el$3, solid_js_web.createComponent(solid_js.For, {
					each: tags,
					children: (name, i) => [solid_js_web.memo(() => solid_js_web.memo(() => !!i())() ? \` \${helper.t("other.or")} \` : ""), solid_js_web.createComponent(TagBase, {
						name,
						get weak() {
							return props.weak;
						}
					})]
				}), _el$6);
				return _el$3;
			}
		});
	};
	const WarnItem = (props) => {
		const [before, middle, after] = props.text.split("[tag]");
		return solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return props.warnList?.size;
			},
			get children() {
				return solid_js_web.createComponent(solid_js.For, {
					get each() {
						return [...props.warnList.entries()];
					},
					children: ([tag, tags]) => (() => {
						var _el$7 = _tmpl$3();
						solid_js_web.insert(_el$7, before, null);
						solid_js_web.insert(_el$7, solid_js_web.createComponent(Tag, { name: tag }), null);
						solid_js_web.insert(_el$7, middle, null);
						solid_js_web.insert(_el$7, solid_js_web.createComponent(solid_js.For, {
							each: tags,
							children: (tagName) => solid_js_web.createComponent(Tag, {
								name: tagName,
								get weak() {
									return props.weak;
								}
							})
						}), null);
						solid_js_web.insert(_el$7, after, null);
						return _el$7;
					})()
				});
			}
		});
	};
	let root;
	let dispose;
	const updateLint = helper.singleThreaded(() => {
		const newWarnList = {};
		const [lockTags, weakTags] = getTaglist();
		const tagList = /* @__PURE__ */ new Set([...lockTags, ...weakTags]);
		/** 根据指定规则检查标签并记录 */
		const checkRules = (tag, ruleName, has = false) => {
			const rules = lintRules[ruleName];
			if (!rules.has(tag)) return;
			for (const targetTag of rules.get(tag)) {
				if (userscript_ehTagRules.hasTag(has ? lockTags : tagList, targetTag) === has) continue;
				newWarnList[ruleName] ??= /* @__PURE__ */ new Map([[tag, []]]);
				const warn = newWarnList[ruleName];
				if (!warn.has(tag)) warn.set(tag, []);
				warn.get(tag).push(targetTag);
			}
		};
		for (const tag of tagList) {
			checkRules(tag, "prerequisite", true);
			checkRules(tag, "conflict");
			if (isManga) checkRules(tag, "possibleConflict");
			checkRules(tag, "combo", true);
		}
		const addOtherWarn = (text, tags) => {
			newWarnList.other ??= [];
			newWarnList.other.push([text, tags]);
		};
		const correctTags = [];
		for (const tag of weakTags) if (/^(?:artist|group):/u.test(tag)) {
			const title = helper.querySelector("#gd2").textContent.toLowerCase();
			if (title.includes(tag.replaceAll(/^(?<_>artist|group):|_/gu, " ").trim())) correctTags.push(tag);
			else {
				const showName = document.getElementById(\`ta_\${tag}\`)?.textContent;
				if (showName && title.includes(showName)) correctTags.push(tag);
			}
		}
		if (correctTags.length > 0) addOtherWarn(helper.t("eh_tag_lint.correct_tag"), correctTags);
		if (isInCategories("Doujinshi") && userscript_ehTagRules.isMissingNamespace(tagList, "parody")) addOtherWarn(helper.t("eh_tag_lint.miss_parody"), ["parody:original"]);
		if (isManga && userscript_ehTagRules.isMissingTags(lockTags, "female:females_only", "female:futanari", "female:shemale") && userscript_ehTagRules.isMissingNamespace(tagList, "male", "mixed")) addOtherWarn(helper.t("eh_tag_lint.miss_female"), ["female:females_only"]);
		setWarnList(newWarnList);
		if (!root?.isConnected) {
			root = document.createElement("div");
			root.id = "comidread-tag-lint";
			helper.querySelector("#taglist").append(root);
		}
		dispose?.();
		dispose = solid_js_web.render(() => solid_js_web.createComponent(solid_js.Show, {
			get when() {
				return Object.keys(warnList()).length;
			},
			get children() {
				return [_tmpl$4(), (() => {
					var _el$9 = _tmpl$5();
					solid_js_web.insert(_el$9, solid_js_web.createComponent(solid_js.For, {
						get each() {
							return warnList().other;
						},
						children: ([text, tags]) => (() => {
							var _el$0 = _tmpl$3();
							solid_js_web.insert(_el$0, text, null);
							solid_js_web.insert(_el$0, solid_js_web.createComponent(solid_js.For, {
								each: tags,
								children: (tagName) => solid_js_web.createComponent(Tag, {
									name: tagName,
									weak: true
								})
							}), null);
							return _el$0;
						})()
					}), null);
					solid_js_web.insert(_el$9, solid_js_web.createComponent(WarnItem, {
						get warnList() {
							return warnList().prerequisite;
						},
						get text() {
							return helper.t("eh_tag_lint.prerequisite");
						},
						weak: false
					}), null);
					solid_js_web.insert(_el$9, solid_js_web.createComponent(WarnItem, {
						get warnList() {
							return warnList().conflict;
						},
						get text() {
							return helper.t("eh_tag_lint.conflict");
						}
					}), null);
					solid_js_web.insert(_el$9, solid_js_web.createComponent(WarnItem, {
						get warnList() {
							return warnList().possibleConflict;
						},
						get text() {
							return helper.t("eh_tag_lint.possible_conflict");
						}
					}), null);
					solid_js_web.insert(_el$9, solid_js_web.createComponent(WarnItem, {
						get warnList() {
							return warnList().combo;
						},
						get text() {
							return helper.t("eh_tag_lint.combo");
						},
						weak: true
					}), null);
					return _el$9;
				})()];
			}
		}), root);
	});
	updateLint();
	helper.hijackFn("tag_update_vote", updateLint);
	const [inputTagList, setInputTagList] = helper.createEqualsSignal([]);
	helper.css(helper.createRootMemo(() => inputTagList().map((tag) => \`#td_\${CSS.escape(tag.replaceAll(" ", "_"))} { box-shadow: 0px 0px 4px var(--tag); }\`).join("\\n")));
	const { newTagField } = pageCtx.dom;
	const updateInputTagList = () => setInputTagList(newTagField.value.split(",").map((tag) => getTagNameFull(tag.trim())).filter(Boolean));
	newTagField.addEventListener("input", updateInputTagList);
	newTagField.addEventListener("keydown", updateInputTagList);
	helper.hijackFn("tag_update_vote", updateInputTagList);
};
solid_js_web.delegateEvents(["click"]);
//#endregion
//#region src/site/ehentai/index.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<hr>\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<p class="g2 gsp"style=padding-bottom:0><img src=https://ehgt.org/g/mr.gif>\`);
core.setupSiteAdapter({
	name: "ehentai",
	options: featureOptions,
	getPageContext,
	handlers: {
		all: ({ setState, setOptions, options }) => {
			const SiteSettings = () => [
				solid_js_web.createComponent(solid_js.For, {
					each: [
						"colorize_tag",
						"float_tag_list",
						"expand_tag_list",
						"tag_lint",
						"",
						"quick_favorite",
						"quick_rating",
						"quick_tag_define",
						"",
						"cross_site_link",
						"detect_ad",
						"add_hotkeys_actions",
						"auto_adjust_option"
					],
					children: (name) => solid_js_web.createComponent(solid_js.Show, {
						when: name,
						get fallback() {
							return _tmpl$();
						},
						get children() {
							return solid_js_web.createComponent(components_Manga.SettingsItemSwitch, {
								get name() {
									return helper.t(\`site.add_feature.\${name}\`);
								},
								get value() {
									return options[name];
								},
								onChange: (v) => setOptions({ [name]: v })
							});
						}
					})
				}),
				_tmpl$(),
				solid_js_web.createComponent(components_Manga.SettingBlockSubtitle, { get children() {
					return helper.t("other.hotkeys");
				} }),
				solid_js_web.createComponent(components_Manga.SettingHotkeys, { keys: ["float_tag_list"] })
			];
			setState((state) => {
				state.manga.editSettingList = (list) => [...list, ["E-Hentai", SiteSettings]];
				state.fab.optionsSpeedDial = [
					"tag_lint",
					"colorize_tag",
					"cross_site_link",
					"detect_ad"
				];
			});
			core.setEscPriority([
				"关闭显示标签定义",
				"取消选中当前标签",
				"关闭浮动标签栏"
			]);
		},
		mpv: ({ setState }) => {
			setState("comicMap", "", { getImgList({ dynamicLazyLoad }) {
				const imagelist = unsafeWindow.imagelist;
				const loadImg = async (i) => {
					const url = () => imagelist[i].i;
					while (!url()) {
						if (!Reflect.has(imagelist[i], "xhr")) {
							unsafeWindow.load_image(i + 1);
							unsafeWindow.next_possible_request = 0;
						}
						await helper.wait(url);
					}
					return url();
				};
				return dynamicLazyLoad({
					loadImg,
					length: imagelist.length
				});
			} });
		},
		gallery: async (coreCtx, pageCtx) => {
			if (Number.isNaN(pageCtx.imgNum)) return core.toast.error(helper.t("site.changed_load_failed"));
			const { newTagField, sidebar } = pageCtx.dom;
			newTagField.addEventListener("keydown", (e) => e.key === "Escape" && newTagField.blur());
			const { setState, options } = coreCtx;
			sidebarOverflow(coreCtx, pageCtx);
			const { handleClick } = await multiSelectLoad(coreCtx, pageCtx);
			solid_js_web.render(() => {
				const hasMultiPage = sidebar.children[6]?.classList.contains("gsp");
				return (() => {
					var _el$3 = _tmpl$2();
					_el$3.firstChild;
					solid_js_web.setStyleProperty(_el$3, "padding-top", hasMultiPage ? 0 : void 0);
					_el$3.addEventListener("click", handleClick, true);
					solid_js_web.insert(_el$3, solid_js_web.createComponent(LoadButton, {
						id: "",
						context: coreCtx,
						get imgNum() {
							return pageCtx.imgNum;
						}
					}), null);
					return _el$3;
				})();
			}, sidebar);
			/** 刷新指定图片 */
			const reloadImg = helper.singleThreaded(async (_, url) => {
				const i = pageCtx.imgList.indexOf(url);
				if (i === -1) return;
				pageCtx.imgList[i] = await getImgUrl(pageCtx, i);
				if (!await helper.testImgUrl(pageCtx.imgList[i])) {
					await updatePageUrl(pageCtx, i);
					pageCtx.imgList[i] = await getImgUrl(pageCtx, i);
					core.toast.warn(helper.t("alert.retry_get_img_url", { i }));
					if (!await helper.testImgUrl(pageCtx.imgList[i])) {
						await helper.sleep(500);
						return reloadImg(url);
					}
				}
				setState("comicMap", "", "imgList", i, pageCtx.imgList[i]);
				for (const img of components_Manga.imgList()) if (img.loadType === "error") return reloadImg(img.src);
			});
			setState((state) => {
				state.manga.title = pageCtx.japanTitle || pageCtx.galleryTitle;
				state.manga.onExit = (isEnd) => {
					if (isEnd) helper.scrollIntoView("#cdiv");
					setState("manga", "show", false);
				};
				state.manga.onImgError = reloadImg;
				state.fab.initialShow = options.autoShow;
			});
		}
	},
	features: {
		colorize_tag: colorizeTag,
		quick_favorite: quickFavorite,
		quick_rating: quickRating,
		expand_tag_list: expandTagList,
		add_hotkeys_actions: addHotkeysActions,
		float_tag_list: floatTagList,
		quick_tag_define: quickTagDefine,
		tag_lint: tagLint,
		cross_site_link: crossSiteLink,
		auto_adjust_option: ({ setState }, pageCtx) => {
			if (pageCtx.type !== "gallery") return;
			if (isInCategories("Doujinshi", "Manga", "Non-H")) return;
			setState((state) => {
				const option = { pageNum: 1 };
				state.manga.defaultOption = helper.assign(state.manga.defaultOption ?? {}, option);
				state.manga.option = helper.assign(state.manga.option ?? {}, option);
			});
		}
	}
});
//#endregion
`,
	"site/jm": `\nlet core = require("core");
let helper = require("helper");
//#region src/site/jm.tsx
core.setupSiteAdapter({
	name: "jm",
	getPageContext: () => {
		if (!location.pathname.includes("/photo/")) return;
		return { type: "manga" };
	},
	handlers: { manga: async ({ setState }) => {
		if (!await helper.wait(() => unsafeWindow?.onImageLoaded, 5e3)) {
			core.toast.error("无法获取图片", { duration: Infinity });
			return;
		}
		setState("manga", {
			onPrev: helper.querySelectorClick(".menu-bolock-ul :has(> .fa-angle-double-left)"),
			onNext: helper.querySelectorClick(".menu-bolock-ul :has(> .fa-angle-double-right)")
		});
		const imgEleList = helper.querySelectorAll(".scramble-page:not(.thewayhome) > img");
		if (unsafeWindow.aid < unsafeWindow.scramble_id || unsafeWindow.speed === "1") return setState("comicMap", "", { getImgList: () => imgEleList.map((e) => e.dataset.original ?? "") });
		const downloadImg = async (url) => {
			try {
				return await core.request(url, {
					responseType: "blob",
					fetch: true,
					noTip: true
				}, 3);
			} catch {
				return await core.request(url, {
					responseType: "blob",
					revalidate: true,
					fetch: false
				}, 3);
			}
		};
		const loadImg = async (i) => {
			const imgEle = imgEleList[i];
			const originalUrl = imgEle.dataset.original;
			const name = helper.getFileName(originalUrl);
			if (imgEle.dataset.imgUrl) return {
				name,
				src: imgEle.dataset.imgUrl
			};
			const res = await downloadImg(imgEle.dataset.original);
			if (res.response.size === 0) {
				core.toast.warn(\`下载原图时出错: \${imgEle.dataset.page}\`);
				return "";
			}
			imgEle.src = \`\${URL.createObjectURL(res.response)}#\${imgEle.src}\`;
			try {
				await helper.waitImgLoad(imgEle, 1e4);
			} catch {
				URL.revokeObjectURL(imgEle.src);
				imgEle.src = originalUrl;
				core.toast.warn(\`加载原图时出错: \${imgEle.dataset.page}\`);
				return "";
			}
			try {
				if (imgEle.nextElementSibling?.tagName === "CANVAS") imgEle.nextElementSibling.remove();
				unsafeWindow.onImageLoaded(imgEle);
				const blob = await helper.canvasToBlob(imgEle.nextElementSibling, "image/webp", 1);
				URL.revokeObjectURL(imgEle.src);
				if (!blob) throw new Error("转换图片时出错");
				const url = URL.createObjectURL(blob);
				imgEle.dataset.imgUrl = url;
				return {
					name,
					src: url
				};
			} catch (error) {
				imgEle.src = originalUrl;
				core.toast.warn(\`转换图片时出错: \${imgEle.dataset.page}, \${error.message}\`);
				return "";
			}
		};
		await helper.wait(() => {
			const loadedNum = helper.querySelectorAll(".lazy-loaded").length;
			return loadedNum > 0 && helper.querySelectorAll("canvas").length - loadedNum <= 1;
		});
		setState("comicMap", "", { getImgList: ({ dynamicLazyLoad }) => dynamicLazyLoad({
			loadImg,
			length: imgEleList.length
		}) });
	} }
});
//#endregion
`,
	"site/kemono": `\nlet core = require("core");
let helper = require("helper");
let userscript_multiSelect = require("userscript/multiSelect");
//#region src/site/kemono.tsx
const original = (root = document) => [...root.querySelectorAll(".post__thumbnail a")].map((e) => e.href);
const thumbnail = (root = document) => [...root.querySelectorAll(".post__thumbnail img")].map((e) => e.src);
const handlePwa = () => {
	const zipExtension = /* @__PURE__ */ new Set([
		"zip",
		"rar",
		"7z",
		"cbz",
		"cbr",
		"cb7"
	]);
	for (const e of helper.querySelectorAll(".post__attachment a")) {
		if (!zipExtension.has(e.href.split(".").pop())) continue;
		const a = document.createElement("a");
		a.href = \`https://comic-read.pages.dev/?url=\${encodeURIComponent(e.href)}\`;
		a.textContent = e.textContent.replace("Download ", "ComicReadPWA - ");
		a.className = e.className;
		a.style.opacity = ".6";
		e.parentNode.insertBefore(a, e.nextElementSibling);
	}
};
core.setupSiteAdapter({
	name: "kemono",
	options: {
		autoShow: false,
		defaultOption: { pageNum: 1 },
		/** 加载原图 */
		load_original_image: true
	},
	getPageContext: () => {
		const { listId, postId } = /\\/user\\/(?<listId>[^/]+)(?:\\/post\\/(?<postId>[^/]+))?/u.exec(location.pathname)?.groups ?? {};
		if (postId) return {
			type: "manga",
			id: postId
		};
		if (listId) return {
			type: "list",
			id: listId,
			offset: Number(new URLSearchParams(location.search).get("o")) || 0
		};
	},
	handlers: {
		manga: async ({ store, setState, showComic }) => {
			await helper.waitDom(".post__thumbnail");
			handlePwa();
			helper.createEffectOn(() => store.options.load_original_image, (isOriginal, prev) => {
				setState("nowComic", isOriginal ? "original" : "thumbnail");
				if (prev) showComic();
			});
			setState((state) => {
				state.comicMap.original = { getImgList: () => original() };
				state.comicMap.thumbnail = { getImgList: () => thumbnail() };
				state.manga.onNext = helper.querySelectorClick(".post__nav-link.next");
				state.manga.onPrev = helper.querySelectorClick(".post__nav-link.prev");
			});
		},
		list: async (coreCtx, { id }) => {
			const ms = await userscript_multiSelect.useMultiSelectLoad(coreCtx, {
				id,
				onStart: () => {
					for (const item of helper.querySelectorAll(".post-card")) item.style.position = "relative";
				},
				getImgList: async (postId) => {
					const res = await core.request(\`\${location.pathname}/post/\${postId}\`);
					const doc = helper.domParse(res.responseText);
					return coreCtx.options.load_original_image ? original(doc) : thumbnail(doc);
				}
			});
			await ms.registerItems(id, async (map) => {
				for (const dom of await helper.waitDom(".post-card", 20)) map.set(dom, dom.dataset.id);
			});
			return ms.createCleanup(id);
		}
	}
});
//#endregion
`,
	"site/nhentai": `\nlet solid_js_web = require("solid-js/web");
let core = require("core");
let helper = require("helper");
let userscript_detectAd = require("userscript/detectAd");
//#region src/userscript/nhentaiApi.ts
const nhApi = (url, details) => core.request(url, {
	responseType: "json",
	headers: { "User-Agent": navigator.userAgent },
	fetch: false,
	...details
});
const getNhentaiData = async (id) => {
	const { response } = await nhApi(\`https://nhentai.net/api/v2/galleries/\${id}\`, {
		errorText: helper.t("site.ehentai.nhentai_error"),
		noTip: true
	});
	return response;
};
const toImgList = (data) => data.pages.map((page) => ({
	src: \`https://i.nhentai.net/\${page.path}\`,
	width: page.width,
	height: page.height
}));
//#endregion
//#region src/site/nhentai.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<a href=javascript:; id=comicReadMode class="btn btn-secondary"><i class="fa fa-book"></i> Read\`);
/** 等待水合完成，确保之后的 dom 操作不会被水合覆盖 */
const waitHydrated = () => helper.waitDom("#svelte-announcer", 1, 5e3);
core.setupSiteAdapter({
	name: "nhentai",
	options: {
		/** 无限滚动 */
		auto_page_turn: true,
		/** 彻底屏蔽漫画 */
		block_totally: true,
		/** 在新页面中打开链接 */
		open_link_new_page: true,
		/** 识别广告页 */
		detect_ad: true
	},
	getPageContext: () => {
		const galleryId = /^\\/g\\/(?<id>\\d+)/u.exec(location.pathname)?.groups?.id;
		if (galleryId) return {
			type: "manga",
			galleryId
		};
		if (helper.querySelector(".container.index-container")) return { type: "list" };
	},
	handlers: { manga: async ({ setState, showComic }) => {
		setState("manga", { onExit(isEnd) {
			if (isEnd) helper.scrollIntoView("#comment-container");
			setState("manga", "show", false);
		} });
		setState("comicMap", "", { getImgList: async () => {
			const galleryId = /^\\/g\\/(?<id>\\d+)/u.exec(location.pathname)?.groups?.id;
			if (!galleryId) throw new Error(helper.t("site.changed_load_failed"));
			const galleryData = await getNhentaiData(galleryId);
			return toImgList(galleryData);
		} });
		await waitHydrated();
		const comicReadModeDom = (() => {
			var _el$ = _tmpl$();
			_el$.$$click = () => showComic();
			return _el$;
		})();
		document.getElementById("download")?.after(comicReadModeDom);
	} },
	features: {
		/** 识别广告页 */
		detect_ad: async ({ store, setState }, pageCtx) => {
			if (pageCtx.type !== "manga") return;
			if (!helper.querySelector("#tags .tag[href=\\"/tag/extraneous-ads/\\"]")) return;
			setState("comicMap", "", "adList", new helper.ReactiveSet());
			await userscript_detectAd.getAdPageByContent(helper.querySelectorAll(".thumb-container img").map((img) => img.src), store.comicMap[""].adList);
			helper.createEffectOn(() => store.comicMap[""].imgList, (imgList) => imgList?.length && userscript_detectAd.getAdPageByContent(imgList.map((img) => typeof img === "string" ? img : img.src), store.comicMap[""].adList));
			helper.css(() => {
				if (!store.comicMap[""]?.adList?.size) return "";
				return [...store.comicMap[""].adList].map((i) => \`
              .thumb-container:nth-of-type(\${i + 1}):not(:hover) {
                filter: blur(8px);
                clip-path: border-box;
              }\`).join("\\n");
			});
		},
		/** 彻底屏蔽漫画 */
		block_totally: (_, pageCtx) => {
			if (pageCtx.type !== "list") return;
			helper.css\`
        .blacklisted.gallery {
          display: none;
        }
      \`;
		},
		/** 在新页面中打开链接 */
		open_link_new_page: async (_, pageCtx) => {
			if (pageCtx.type !== "list") return;
			await waitHydrated();
			for (const e of helper.querySelectorAll("a:not([href^=\\"javascript:\\"])")) e.setAttribute("target", "_blank");
		},
		/** 无限滚动 */
		auto_page_turn: async (_, pageCtx) => {
			if (pageCtx.type !== "list") return;
			await waitHydrated();
			let nextUrl = helper.querySelector("a.next")?.href;
			let lastUrl = location.href;
			if (!nextUrl) return;
			helper.css\`
        hr {
          bottom: 1px;
          box-sizing: border-box;
          margin: -1em auto 2em;
        }

        hr:last-child {
          position: relative;
          animation: load 0.8s linear alternate infinite;
        }

        hr:not(:last-child) {
          display: none;
        }

        @keyframes load {
          0% {
            transform: scaleX(1);
          }

          100% {
            transform: scaleX(0);
          }
        }
      \`;
			const contentDom = document.getElementById("content");
			const getObserveDom = () => contentDom.querySelector(":is(.index-container, #favcontainer):last-of-type");
			const loadNextPage = helper.singleThreaded(async () => {
				if (!nextUrl) return;
				const res = await core.request(nextUrl, {
					fetch: true,
					errorText: helper.t("site.nhentai.fetch_next_page_failed")
				});
				const html = helper.domParse(res.responseText);
				const pagination = html.querySelector(".pagination");
				history.pushState(null, "", lastUrl);
				lastUrl = nextUrl;
				nextUrl = pagination.querySelector("a.next")?.href;
				contentDom.append(html.querySelector(".index-container, #favcontainer"), pagination);
				const hr = document.createElement("hr");
				contentDom.append(hr);
				observer.disconnect();
				observer.observe(getObserveDom());
				if (!nextUrl) hr.style.animationPlayState = "paused";
			}, { abandon: true });
			const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadNextPage(), { threshold: .5 });
			observer.observe(getObserveDom());
			if (helper.querySelector("section.pagination")) contentDom.append(document.createElement("hr"));
			return () => observer.disconnect();
		}
	}
});
solid_js_web.delegateEvents(["click"]);
//#endregion
`,
	"site/pixiv": `\nlet core = require("core");
let helper = require("helper");
let userscript_multiSelect = require("userscript/multiSelect");
//#region src/site/pixiv.tsx
let imgs = [];
core.setupSiteAdapter({
	name: "pixiv",
	options: {
		autoShow: false,
		defaultOption: { pageNum: 1 },
		/** 加载原图 */
		load_original_image: true
	},
	getPageContext: async () => {
		const listId = /^\\/users\\/(?<listId>\\d+)/u.exec(location.pathname)?.groups?.listId;
		if (listId) return {
			type: "list",
			id: listId
		};
		if (!location.pathname.startsWith("/artworks/")) return;
		const id = /^\\/artworks\\/(?<artworkId>\\d+)/u.exec(location.pathname)?.groups?.artworkId;
		if (!id) {
			imgs.length = 0;
			return;
		}
		const res = await core.request(\`/ajax/illust/\${id}/pages\`, { responseType: "json" });
		if (res.response.body.length === 0) return;
		imgs = res.response.body;
		return {
			type: "manga",
			id
		};
	},
	handlers: {
		manga: ({ store, setState, showComic }) => {
			helper.createEffectOn(() => store.options.load_original_image, (isOriginal, prev) => {
				setState("nowComic", isOriginal ? "original" : "regular");
				if (prev) showComic();
			});
			const getImgList = (isOriginal) => () => imgs.map((img) => {
				return {
					src: isOriginal ? img.urls.original : img.urls.regular,
					height: img.height,
					width: img.width
				};
			});
			setState((state) => {
				state.comicMap.original = { getImgList: getImgList(true) };
				state.comicMap.regular = { getImgList: getImgList(false) };
			});
		},
		list: async (coreCtx, { id }) => {
			const { options } = coreCtx;
			const ms = await userscript_multiSelect.useMultiSelectLoad(coreCtx, {
				id,
				getImgList: async (workId) => {
					const res = await core.request(\`/ajax/illust/\${workId}/pages\`, { responseType: "json" });
					if (options.load_original_image) return res.response.body.map((img) => img.urls.original);
					return res.response.body.map((img) => img.urls.regular);
				}
			});
			await ms.registerItems(id, async (map) => {
				for (const dom of await helper.waitDom("li div[data-worktype=\\"illusts\\"]")) map.set(dom, dom.dataset.workid);
			});
			return ms.createCleanup(id);
		}
	}
});
//#endregion
`,
	"site/selfhosted": `\nlet components_Manga = require("components/Manga");
let core = require("core");
let helper = require("helper");
let request = require("request");
//#region src/site/selfhosted.tsx
if (document.querySelector(\`head > meta[content="A manga reader that runs tachiyomi's extensions"]\`)) {
	const jump = (mangaId, chapterId) => {
		location.pathname = \`/manga/\${mangaId}/chapter/\${chapterId}\`;
	};
	const getChapters = async (mangaId, chapterId) => {
		const res = await request.request("/api/graphql", {
			method: "POST",
			data: JSON.stringify({
				operationName: "GET_CHAPTERS",
				query: \`query GET_CHAPTERS($mangaId: Int!, $chapterId: Int!) {
                chapters(condition: {
                  mangaId: $mangaId, sourceOrder: $chapterId}
                ) { nodes { pageCount } }
                manga(id: $mangaId) { chapters { totalCount } }
              }\`,
				variables: {
					mangaId,
					chapterId
				}
			}),
			responseType: "json"
		});
		if (res.response.data.chapters.nodes[0].pageCount <= 0) {
			await helper.sleep(200);
			return getChapters(mangaId, chapterId);
		}
		return res.response.data;
	};
	core.setup({
		name: "Tachidesk",
		isMangaPage: () => {
			const match = /\\/manga\\/(?<mangaId>\\d+)\\/chapter\\/(?<chapterId>\\d+)/u.exec(location.pathname)?.groups;
			if (!match) return false;
			return {
				mangaId: Number(match.mangaId),
				chapterId: Number(match.chapterId)
			};
		},
		async getImgList({ setState }, { mangaId, chapterId }) {
			const data = await getChapters(mangaId, chapterId);
			const [{ pageCount }] = data.chapters.nodes;
			const chapterCount = data.manga.chapters.totalCount;
			setState("manga", {
				onPrev: chapterId > 0 ? () => jump(mangaId, chapterId - 1) : void 0,
				onNext: chapterId < chapterCount ? () => jump(mangaId, chapterId + 1) : void 0
			});
			return helper.range(pageCount, (i) => \`/api/v1/manga/\${mangaId}/chapter/\${chapterId}/page/\${i}\`);
		},
		handler: ({ setState }) => setState("manga", { onShowImgsChange: helper.debounce((showImgs, imgList) => {
			const lastImgUrl = imgList[[...showImgs].at(-1)].src;
			helper.querySelector(\`img[src$="\${lastImgUrl}"]\`)?.scrollIntoView({
				behavior: "instant",
				block: "end"
			});
		}, 500) })
	});
}
if (location.pathname === "/reader" && document.querySelector(".ip > a[href=\\"https://github.com/Difegue/LANraragi\\"]")?.textContent.trim() === "LANraragi.") {
	let initFlag = true;
	/** 是否由服务器来跟踪进度 */
	let isServerTracksProgress;
	const checkServerTracksProgress = async () => {
		if (isServerTracksProgress !== void 0) return;
		isServerTracksProgress = (await request.request("/api/info", {
			responseType: "json",
			fetch: true,
			noTip: true
		})).response.server_tracks_progress;
	};
	const getProgress = async (id) => {
		await checkServerTracksProgress();
		if (!isServerTracksProgress) return Number(localStorage.getItem(\`\${id}-reader\`)) - 1 || 0;
		return (await request.request(\`/api/archives/\${id}/metadata\`, {
			responseType: "json",
			errorText: "Error fetching progress",
			fetch: true
		})).response.progress - 1;
	};
	const updateProgress = async (id, pageNum) => {
		await checkServerTracksProgress();
		if (isServerTracksProgress) await request.request(\`/api/archives/\${id}/progress/\${pageNum + 1}\`, {
			method: "PUT",
			fetch: true,
			noTip: true
		});
		else localStorage.setItem(\`\${id}-reader\`, \`\${pageNum + 1}\`);
	};
	core.setup({
		name: "LANraragi",
		isMangaPage: () => {
			if (location.pathname !== "/reader") return;
			const id = new URLSearchParams(location.search).get("id");
			if (id) return { id };
		},
		getImgList: async (_, { id }) => {
			await checkServerTracksProgress();
			return (await request.request(\`/api/archives/\${id}/files\`, {
				responseType: "json",
				errorText: "Error fetching image list"
			})).response.pages;
		},
		handler: ({ setState }, { id }) => {
			setState("manga", { onShowImgsChange: helper.debounce((showImgs, imgList) => {
				if (imgList.length > 0 && initFlag) {
					initFlag = false;
					(async () => {
						const progress = await getProgress(id);
						components_Manga.setState((state) => {
							state.activePageIndex = state.pageList.findIndex((page) => page.includes(progress));
						});
					})();
					return;
				}
				updateProgress(id, [...showImgs].at(-1));
			}, 200) });
		}
	});
}
//#endregion
`,
	"site/yamibo": `\nlet solid_js_web = require("solid-js/web");
let core = require("core");
let helper = require("helper");
let solid_js = require("solid-js");
//#region src/site/yamibo.tsx
var _tmpl$ = /*#__PURE__*/ solid_js_web.template(\`<li><a style=color:unset>回第<!>页\`);
var _tmpl$2 = /*#__PURE__*/ solid_js_web.template(\`<a class=historyTag>回第<!>页 \`);
var _tmpl$3 = /*#__PURE__*/ solid_js_web.template(\`<div class=historyTag>+\`);
/** 从 URL 字符串中提取 fid */
const extractFid = (url) => {
	if (!url) return void 0;
	const fid = new URLSearchParams(url).get("fid");
	return fid ? Number(fid) : void 0;
};
core.setupSiteAdapter({
	name: "yamibo",
	options: {
		记录阅读进度: true,
		关闭快捷导航的跳转: true,
		修正点击页数时的跳转判定: true,
		固定导航条: true,
		自动签到: true,
		移动端显示帖子权限: true
	},
	getPageContext: () => {
		if (/thread(?:-\\d+){3}|mod=viewthread/u.test(document.URL)) {
			const tid = unsafeWindow.tid ?? new URLSearchParams(location.search).get("tid") ?? /\\/thread-(?<tid>\\d+)-\\d+-\\d+.html/u.exec(location.pathname)?.groups?.tid;
			if (!tid) return;
			const fid = unsafeWindow.fid || extractFid(location.search) || extractFid(helper.querySelector("h2 > a, .bm.cl a[href*=\\"fid=\\"]")?.href);
			return {
				type: "thread",
				tid,
				fid,
				isManga: fid === 30 || fid === 37
			};
		}
		if (/forum(?:-\\d+){2}|mod=forumdisplay/u.test(document.URL)) return {
			type: "forum",
			isMobile: !document.querySelector("#flk")
		};
	},
	handlers: {
		all: () => {
			helper.css\`
        #fab {
          --fab: #6e2b19;
        }

        .historyTag {
          border: 2px solid #6e2b19;
          white-space: nowrap;
        }

        a.historyTag {
          margin-left: 1em;
          padding: 1px 4px;
          border-radius: 4px 0 0 4px;

          font-weight: bold;
          color: #6e2b19;
        }

        a.historyTag:last-child {
          border-radius: 4px;
        }

        div.historyTag {
          display: initial;

          margin-left: -0.4em;
          padding: 1px;
          border-radius: 0 4px 4px 0;

          color: #ffedbb;

          background-color: #6e2b19;
        }

        #threadlisttableid tbody:nth-child(2n) div.historyTag {
          color: #fff6d7;
        }

        /* 将「回复/查看」列加宽一点 */
        .tl .num {
          width: 80px !important;
        }
      \`;
		},
		thread: ({ setState, options, showComic, loadComic }, { isManga }) => {
			for (const e of helper.querySelectorAll("img[file*=\\"sinaimg.cn\\"]")) e.setAttribute("referrerpolicy", "no-referrer");
			const readMode = () => {
				if (!!helper.querySelector(".pg > .prev")) setState("flag", "needAutoShow", false);
				let imgList = helper.querySelectorAll(":is(.t_fsz, .message) img");
				const getImgList = () => {
					let i = imgList.length;
					while (i--) {
						const img = imgList[i];
						const file = img.getAttribute("file");
						if (file && img.src !== file) {
							img.setAttribute("src", file);
							img.setAttribute("lazyloaded", "true");
						}
						if (img.src.includes("static/image") || img.complete && img.naturalHeight && img.naturalWidth && img.naturalHeight < 500 && img.naturalWidth < 500) imgList.splice(i, 1);
					}
					return imgList.map((img) => img.src);
				};
				setState("comicMap", "", { getImgList });
				setState("manga", {
					onLoading(_imgList, img) {
						if (img && img.width < 500 && img.height < 500) return loadComic();
					},
					onExit(isEnd) {
						if (isEnd) helper.scrollIntoView(".psth, .rate, #postlist > div:nth-of-type(2)");
						setState("manga", "show", false);
					}
				});
				if (helper.querySelector("div.pti > div.authi")) {
					helper.querySelector("div.pti > div.authi").insertAdjacentHTML("beforeend", "<span class=\\"pipe show\\">|</span><a id=\\"comicReadMode\\" class=\\"show\\" href=\\"javascript:;\\">漫画阅读</a>");
					document.getElementById("comicReadMode")?.addEventListener("click", () => showComic());
				}
				if (helper.querySelector("#threadindex")) helper.hijackFn("ajaxinnerhtml", () => {
					imgList = helper.querySelectorAll(".t_fsz img");
					if (imgList.length === 0 || getImgList().length === 0) return;
					if (options.autoShow) showComic();
				});
				const tagDom = helper.querySelector(".ptg.mbm.mtn > a");
				if (tagDom) {
					const [, tagId] = tagDom.href.split("id=");
					const reg = /(?<=<th>\\s<a href="thread-)\\d+(?=-)/gu;
					let threadList = [];
					const setPrevNext = async (pageNum = 1) => {
						const res = await core.request(\`/misc.php?mod=tag&id=\${tagId}&type=thread&page=\${pageNum}\`);
						const newList = Array.from(res.responseText.matchAll(reg), ([tid]) => Number(tid));
						threadList = [...threadList, ...newList];
						const index = threadList.indexOf(unsafeWindow.tid);
						if (newList.length > 0 && (index === -1 || !threadList[index + 1])) return setPrevNext(pageNum + 1);
						return setState("manga", {
							onPrev: threadList[index - 1] ? () => location.assign(\`thread-\${threadList[index - 1]}-1-1.html\`) : void 0,
							onNext: threadList[index + 1] ? () => location.assign(\`thread-\${threadList[index + 1]}-1-1.html\`) : void 0
						});
					};
					setTimeout(setPrevNext);
				}
			};
			if (isManga) readMode();
			else {
				helper.querySelector("div.pti > div.authi").insertAdjacentHTML("beforeend", "<span class=\\"pipe show\\">|</span><a id=\\"comicReadMode\\" class=\\"show\\" href=\\"javascript:;\\">漫画阅读</a>");
				const button = document.getElementById("comicReadMode");
				button?.addEventListener("click", () => {
					button.previousElementSibling?.remove();
					button.remove();
					readMode();
					showComic();
				});
			}
		}
	},
	features: {
		固定导航条: () => helper.css\`
        .header-stackup {
          position: fixed !important;
        }
      \`,
		关闭快捷导航的跳转: () => helper.querySelector("#qmenu a")?.setAttribute("href", "javascript:;"),
		修正点击页数时的跳转判定: (_, pageCtx) => {
			if (pageCtx.type !== "forum") return;
			const list = helper.querySelectorAll(".tps>a");
			let i = list.length;
			while (i--) list[i].setAttribute("onClick", "atarget(this)");
		},
		自动签到: async () => {
			if (!unsafeWindow.discuz_uid || unsafeWindow.discuz_uid === "0") return;
			const todayString = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
			if (todayString === localStorage.getItem("signDate")) return;
			const sign = helper.querySelector("#scbar_form > input[name=\\"formhash\\"]")?.value;
			if (!sign) return;
			try {
				const body = await (await fetch(\`plugin.php?id=zqlj_sign&sign=\${sign}\`)).text();
				if (!/成功！|打过卡/u.test(body)) throw new Error("自动签到失败");
				core.toast.success("自动签到成功");
				localStorage.setItem("signDate", todayString);
			} catch {
				core.toast.error("自动签到失败");
			}
		},
		记录阅读进度: async (_, pageCtx) => {
			if (pageCtx.type === "thread") {
				const { tid } = pageCtx;
				/** 回复数 */
				let allReplies;
				try {
					const res = await core.request(\`/api/mobile/index.php?module=viewthread&tid=\${tid}\`, {
						responseType: "json",
						errorText: "获取帖子回复数时出错",
						noTip: true
					});
					allReplies = Number.parseInt(res.response?.Variables?.thread?.allreplies, 10);
				} catch {}
				/** 当前所在页数 */
				const currentPageNum = Number.parseInt(helper.querySelector("#pgt strong")?.textContent ?? helper.querySelector("#dumppage")?.value ?? "1", 10);
				const cache = await helper.useCache({ history: "tid" });
				const data = await cache.get("history", \`\${tid}\`);
				if (data && currentPageNum < data.lastPageNum) return;
				/** 监视楼层列表 */
				const watchFloorList = helper.querySelectorAll(data?.lastAnchor && currentPageNum === data.lastPageNum ? \`#\${data.lastAnchor} ~ div\` : "#postlist > div, .plc.cl");
				if (watchFloorList.length === 0) return;
				let id = 0;
				/** 储存数据，但是防抖 */
				const debounceSave = (saveData) => {
					if (id) window.clearTimeout(id);
					id = window.setTimeout(async () => {
						id = 0;
						await cache.set("history", saveData);
					}, 200);
				};
				const observer = new IntersectionObserver((entries) => {
					const trigger = entries.find((e) => e.isIntersecting);
					if (!trigger) return;
					const triggerIndex = watchFloorList.indexOf(trigger.target);
					if (triggerIndex === -1) return;
					for (const e of watchFloorList.splice(0, triggerIndex + 1)) observer.unobserve(e);
					debounceSave({
						tid: \`\${tid}\`,
						lastPageNum: currentPageNum,
						lastReplies: allReplies || data?.lastReplies || 0,
						lastAnchor: trigger.target.id
					});
				}, { rootMargin: "-160px" });
				for (const e of watchFloorList) observer.observe(e);
				return () => observer.disconnect();
			}
			if (pageCtx.type === "forum") {
				const { isMobile } = pageCtx;
				const cache = await helper.useCache({ history: "tid" });
				const [updateFlag, setUpdateFlag] = solid_js.createSignal(false);
				const updateHistoryTag = () => setUpdateFlag((val) => !val);
				const { listSelector, getTid, getUrl } = isMobile ? {
					listSelector: ".threadlist li.list",
					getTid: (e) => new URLSearchParams(e.children[1].getAttribute("href")).get("tid"),
					getUrl: (data, tid) => \`forum.php?mod=viewthread&tid=\${tid}&extra=page%3D1&mobile=2&page=\${data.lastPageNum}#\${data.lastAnchor}\`
				} : {
					listSelector: "tbody[id^=normalthread]",
					getTid: (e) => e.id.split("_")[1],
					getUrl: (data, tid) => \`thread-\${tid}-\${data.lastPageNum}-1.html#\${data.lastAnchor}\`
				};
				for (const e of helper.querySelectorAll(listSelector)) {
					const tid = getTid(e);
					solid_js_web.render(() => {
						const [data, setData] = solid_js.createSignal();
						helper.createEffectOn(updateFlag, () => cache.get("history", tid).then(setData));
						const url = solid_js.createMemo(() => data() ? getUrl(data(), tid) : "");
						const lastReplies = solid_js.createMemo(() => !isMobile && data() ? Number(e.querySelector(".num a").innerHTML) - data().lastReplies : 0);
						return solid_js_web.createComponent(solid_js.Show, {
							get when() {
								return Boolean(data());
							},
							get children() {
								return isMobile ? (() => {
									var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$5 = _el$2.firstChild.nextSibling;
									_el$5.nextSibling;
									solid_js_web.addEventListener(_el$2, "click", unsafeWindow.atarget, true);
									solid_js_web.insert(_el$2, () => data()?.lastPageNum, _el$5);
									solid_js_web.effect(() => solid_js_web.setAttribute(_el$2, "href", url()));
									return _el$;
								})() : [(() => {
									var _el$6 = _tmpl$2(), _el$9 = _el$6.firstChild.nextSibling;
									_el$9.nextSibling;
									solid_js_web.addEventListener(_el$6, "click", unsafeWindow.atarget, true);
									solid_js_web.insert(_el$6, () => data()?.lastPageNum, _el$9);
									solid_js_web.effect(() => solid_js_web.setAttribute(_el$6, "href", url()));
									return _el$6;
								})(), solid_js_web.createComponent(solid_js.Show, {
									get when() {
										return lastReplies() > 0;
									},
									get children() {
										var _el$0 = _tmpl$3();
										_el$0.firstChild;
										solid_js_web.insert(_el$0, lastReplies, null);
										return _el$0;
									}
								})];
							}
						});
					}, isMobile ? e.children[3] : e.getElementsByTagName("th")[0]);
				}
				document.addEventListener("visibilitychange", updateHistoryTag);
				helper.querySelector("#autopbn")?.addEventListener("click", updateHistoryTag);
				return () => document.removeEventListener("visibilitychange", updateHistoryTag);
			}
		},
		移动端显示帖子权限: async (_, pageCtx) => {
			if (pageCtx.type !== "forum" || !pageCtx.isMobile) return;
			const apiUrl = new URL(location.href);
			apiUrl.pathname = "/api/mobile/index.php";
			apiUrl.searchParams.set("module", apiUrl.searchParams.get("mod"));
			apiUrl.searchParams.delete("mod");
			const res = await core.request(\`\${apiUrl}\`, {
				responseType: "json",
				errorText: "获取帖子权限时出错"
			});
			const readpermMap = /* @__PURE__ */ new Map();
			for (const { tid, readperm } of res.response.Variables.forum_threadlist) if (readperm !== "0") readpermMap.set(Number(tid), Number(readperm));
			for (const item of helper.querySelectorAll(".threadlist li.list")) {
				const a = item.querySelector("a[href*=\\"&tid=\\"]");
				const tid = Number(new URLSearchParams(a.href).get("tid"));
				if (!readpermMap.has(tid)) continue;
				item.querySelector(".threadlist_foot li.mr").insertAdjacentHTML("beforeend", \`<span style="margin-right: .5em; color: #EE1B2E">#权限\${readpermMap.get(tid)}</span>\`);
			}
		}
	}
});
solid_js_web.delegateEvents(["click"]);
//#endregion
`,
	"site/yurifans": `\nlet core = require("core");
let helper = require("helper");
//#region src/site/yurifans.tsx
core.setupSiteAdapter({
	name: "yurifans",
	options: { 自动签到: true },
	getPageContext: async () => {
		if (!await helper.waitDom("a.post-list-cat-item[title=\\"在线区-漫画\\"]")) return;
		if (helper.querySelector(".content-hidden")) return {
			type: "manga",
			mangaType: "purchased"
		};
		if (helper.querySelector(".xControl")) return {
			type: "manga",
			mangaType: "folded"
		};
		return {
			type: "manga",
			mangaType: "simple"
		};
	},
	handlers: { manga: async ({ store, setState, showComic, init }, { mangaType }) => {
		switch (mangaType) {
			case "purchased": {
				const imgList = helper.querySelector(".content-hidden").getElementsByTagName("img");
				if (await helper.wait(() => imgList.length, 1e3)) {
					const getImgList = () => Array.from(imgList, (e) => e.src);
					setState("comicMap", "", { getImgList });
				}
				break;
			}
			case "folded": {
				setState((state) => {
					state.flag.needAutoShow = false;
					state.options.autoShow = false;
				});
				const switchChapter = (i) => {
					showComic(i);
					setState("manga", {
						onPrev: Reflect.has(store.comicMap, i - 1) ? () => switchChapter(i - 1) : void 0,
						onNext: Reflect.has(store.comicMap, i + 1) ? () => switchChapter(i + 1) : void 0
					});
				};
				for (const [i, a] of helper.querySelectorAll(".xControl > a").entries()) {
					const item = a.parentElement.nextElementSibling;
					setState("comicMap", i, { getImgList: () => Array.from(item.querySelectorAll("img"), (e) => e.dataset.src ?? e.src) });
					a.addEventListener("click", () => setTimeout(() => item.style.display !== "none" && switchChapter(i)));
				}
				init();
				break;
			}
			case "simple": {
				await helper.wait(() => helper.querySelectorAll(".entry-content img").length);
				const getImgList = () => helper.querySelectorAll(".entry-content img").map((e) => e.dataset.src || e.src);
				setState("comicMap", "", { getImgList });
				break;
			}
		}
	} },
	features: { 自动签到: async () => {
		if (!globalThis.b2token) return;
		const todayString = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
		if (todayString === localStorage.getItem("signDate")) return;
		try {
			const res = await core.request("/wp-json/b2/v1/userMission", {
				method: "POST",
				noTip: true,
				headers: { Authorization: \`Bearer \${b2token}\` }
			});
			const data = JSON.parse(res.responseText);
			if (!(data?.mission?.date || !Number.isNaN(Number(data)))) throw new Error("签到失败");
			core.toast("自动签到成功");
			localStorage.setItem("signDate", todayString);
		} catch {
			core.toast.error("自动签到失败");
		}
	} }
});
//#endregion
`
};
//#endregion
//#region src/userscript/import.ts
let supportWorker;
const gmApi = {
	GM: typeof GM === "undefined" ? void 0 : GM,
	GM_addElement: typeof GM_addElement === "undefined" ? void 0 : GM_addElement,
	GM_getResourceText: typeof GM_getResourceText === "undefined" ? void 0 : GM_getResourceText,
	GM_xmlhttpRequest: typeof GM_xmlhttpRequest === "undefined" ? void 0 : GM_xmlhttpRequest,
	unsafeWindow: typeof unsafeWindow === "undefined" ? window : unsafeWindow
};
const gmApiList = Object.keys(gmApi);
const crsLib = {
	process: { env: { NODE_ENV: "production" } },
	...gmApi
};
const tempName = Math.random().toString(36).slice(2);
const getResource = (name) => {
	const text = gmApi.GM_getResourceText?.(name.replaceAll("/", "|").replaceAll("@", "_"));
	if (!text) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);
	if (name === "@tensorflow/tfjs-backend-webgpu") return text.replace("@tensorflow/tfjs-core", "@tensorflow/tfjs");
	return text;
};
const evalCode = (code) => {
	if (!code) return;
	if (gmApi.GM_addElement) return GM_addElement("script", { textContent: code })?.remove();
	eval.call(gmApi.unsafeWindow, code);
};
const selfImport = (name) => {
	let libCode = libCodeMap[name] ?? getResource(name);
	if (name.startsWith("worker/") && supportWorker) try {
		const importModule = /* @__PURE__ */ new Map([["Comlink", getResource("comlink")]]);
		const handleCode = (code) => code.replaceAll(/require\(['"](?<moduleName>.+?)['"]\)/gu, (_, moduleName) => {
			if (!importModule.has(moduleName)) importModule.set(moduleName, handleCode(getResource(moduleName)));
			return `moduleMap['${moduleName}']`;
		});
		const moduleCode = handleCode(libCode);
		let workerCode = `const moduleMap = {};\n`;
		for (const [moduleName, code] of importModule) workerCode += `
moduleMap['${moduleName}'] = {};
(function (exports, module) { ${code} }) (
  moduleMap['${moduleName}'],
  {
    set exports(value) { moduleMap['${moduleName}'] = value; },
    get exports() { return moduleMap['${moduleName}']; }
  },
);\n`;
		workerCode += `
const exports = {};
${moduleCode}
moduleMap['Comlink'].expose(exports);`;
		const codeUrl = URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" }));
		setTimeout(() => URL.revokeObjectURL(codeUrl));
		const worker = new Worker(codeUrl);
		crsLib[name] = require("comlink").wrap(worker);
		return;
	} catch {}
	let runCode = `
    (function (process, require, exports, module, ${gmApiList.join(", ")}) {
      ${libCode}
    })(
      window['${tempName}'].process,
      window['${tempName}'].require,
      window['${tempName}']['${name}'],
      ((module) => ({
        set exports(value) { module['${name}'] = value; },
        get exports() { return module['${name}']; },
      }))(window['${tempName}']),
      ${gmApiList.map((apiName) => `window['${tempName}'].${apiName}`).join(", ")}
    );
  `;
	gmApi.unsafeWindow[tempName] = crsLib;
	gmApi.unsafeWindow[tempName][name] = {};
	evalCode(runCode);
	Reflect.deleteProperty(gmApi.unsafeWindow, tempName);
};
/**
* 创建一个外部模块的 Proxy，等到读取对象属性时才加载模块
* @param name 外部模块名
*/
const require = (name) => {
	const __esModule = { value: true };
	const selfLibProxy = () => {};
	selfLibProxy.default = {};
	const selfDefault = new Proxy(selfLibProxy, {
		get(_, prop) {
			if (prop === "__esModule") return __esModule;
			if (prop === "default") return selfDefault;
			if (!crsLib[name]) selfImport(name);
			if (Reflect.has(crsLib[name], "default") && Reflect.has(crsLib[name].default, prop)) return crsLib[name].default[prop];
			return crsLib[name][prop];
		},
		apply(_, __, args) {
			if (!crsLib[name]) selfImport(name);
			const module = crsLib[name];
			return (typeof module.default === "function" ? module.default : module)(...args);
		},
		construct(_, args) {
			if (!crsLib[name]) selfImport(name);
			const module = crsLib[name];
			return new (typeof module.default === "function" ? module.default : module)(...args);
		},
		ownKeys() {
			if (!crsLib[name]) selfImport(name);
			return Reflect.ownKeys(crsLib[name]);
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		}
	});
	return selfDefault;
};
crsLib.require = require;
({supportWorker} = require("userscript/supportWorker"));
//#endregion
let components_Manga = require("components/Manga");
let core = require("core");
let helper = require("helper");
let helper_languages = require("helper/languages");
let request = require("request");
let userscript_copyApi = require("userscript/copyApi");
let userscript_otherSite = require("userscript/otherSite");
//#region src/userscript/nhentaiApi.ts
const nhApi = (url, details) => core.request(url, {
	responseType: "json",
	headers: { "User-Agent": navigator.userAgent },
	fetch: false,
	...details
});
const getNhentaiData = async (id) => {
	const { response } = await nhApi(`https://nhentai.net/api/v2/galleries/${id}`, {
		errorText: helper.t("site.ehentai.nhentai_error"),
		noTip: true
	});
	return response;
};
const toImgList = (data) => data.pages.map((page) => ({
	src: `https://i.nhentai.net/${page.path}`,
	width: page.width,
	height: page.height
}));
//#endregion
//#region src/userscript/zaimanhuaApi.ts
/** 获取再漫画吐槽列表 */
const getZaiManHuaCommentList = async (comicId, chapterId) => {
	const { errno, errmsg, data: { list = [] } = {} } = (await request.request(`https://v4api.zaimanhua.com/app/v1/viewpoint/list?type=0&comicId=${comicId}&chapterId=${chapterId}`, { responseType: "json" })).response;
	if (errno) throw new Error(errmsg || "获取吐槽列表失败");
	return list.map((comment) => comment[7]).filter(Boolean);
};
//#endregion
//#region src/index.ts
try {
	switch (location.hostname) {
		case "bbs.yamibo.com":
			selfImport("site/yamibo");
			break;
		case "www.yamibo.com": {
			if (location.pathname !== "/manga/view-chapter") break;
			const id = new URLSearchParams(location.search).get("id");
			if (!id) break;
			/** 总页数 */
			const totalPageNum = Number(helper.querySelector("section div:first-of-type div:last-of-type").innerHTML.split("：")[1]);
			if (Number.isNaN(totalPageNum)) throw new Error(helper.t("site.changed_load_failed"));
			/** 获取指定页数的图片 url */
			const loadImg = async (i) => {
				const res = await core.request(`https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`);
				return /(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/u.exec(res.responseText)[0].replaceAll("&amp;", "&").replaceAll("http://", "https://");
			};
			core.setup({
				name: "newYamibo",
				getImgList: ({ dynamicLazyLoad }) => dynamicLazyLoad({
					loadImg,
					length: totalPageNum
				}),
				onNext: () => helper.querySelectorClick("#btnNext"),
				onPrev: () => helper.querySelectorClick("#btnPrev"),
				onExit: (isEnd) => isEnd && helper.scrollIntoView("#w1")
			});
			break;
		}
		case "exhentai.org":
		case "e-hentai.org":
			selfImport("site/ehentai");
			break;
		case "nhentai.net":
			selfImport("site/nhentai");
			break;
		case "yuri.website":
			selfImport("site/yurifans");
			break;
		case "www.copy3000.com":
		case "copy3000.com":
		case "www.2026copy.com":
		case "2026copy.com":
		case "www.2025copy.com":
		case "2025copy.com":
		case "www.copy20.com":
		case "copy20.com":
		case "www.copy4000.com":
		case "mangacopy.com":
		case "www.mangacopy.com":
			selfImport("site/copymanga");
			break;
		case "www.zaimanhua.com":
		case "manhua.zaimanhua.com":
			core.setup({
				name: "zaiManHua",
				isMangaPage: async () => {
					if (!location.pathname.startsWith("/view/")) return false;
					await helper.wait(() => Boolean(helper.querySelector(".scrollbar-demo-item")));
					return true;
				},
				getImgList: async () => {
					await helper.wait(() => {
						const dom = helper.querySelector("#qiehuan_txt");
						if (!dom) return;
						if (dom.textContent !== "切换到上下滚动阅读") return true;
						dom.click();
						return helper.sleep(1e3);
					});
					return helper.querySelectorAll(".scrollbar-demo-item img").map((img) => img.src);
				},
				onNext: () => helper.querySelectorClick("#next_chapter"),
				onPrev: () => helper.querySelectorClick("#prev_chapter"),
				handler: ({ setState }) => {
					const [, , , comicId, chapterId] = location.pathname.split("/");
					if (!comicId || !chapterId) throw new Error(helper.t("site.changed_load_failed"));
					(async () => {
						try {
							const comments = await getZaiManHuaCommentList(comicId, chapterId);
							if (comments.length > 0) setState("manga", "commentList", comments);
						} catch (error) {
							helper.log.error(error);
						}
					})();
				}
			});
			break;
		case "m.zaimanhua.com": {
			const api = async (apiPath) => {
				const res = await core.request(`https://v4api.zaimanhua.com/app/v1/comic${apiPath}?_v=15`, { responseType: "json" });
				if (res.response.errno) core.toast.error(`${helper.t("alert.comic_load_error")}: ${res.response.errmsg}`, { throw: true });
				return res.response.data.data;
			};
			const getPageData = (comicId, chapterId) => api(`/chapter/${comicId}/${chapterId}`);
			const getComicData = (comicId) => api(`/detail/${comicId}`);
			core.setup({
				name: "zaiManHua",
				isMangaPage: () => {
					if (location.pathname !== "/pages/comic/page") return false;
					const urlParams = new URLSearchParams(location.search);
					const comicId = Number(urlParams.get("comic_id"));
					const chapterId = Number(urlParams.get("chapter_id"));
					if (!comicId || !chapterId) throw new Error(helper.t("site.changed_load_failed"));
					return {
						comicId,
						chapterId
					};
				},
				async getImgList({ setState }, { comicId, chapterId }) {
					const comicData = await getComicData(comicId);
					const chapter = (comicData.chapters.length === 1 ? comicData.chapters[0] : comicData.chapters.find((chapter) => chapter.data.find((data) => data.chapter_id === chapterId))).data.toSorted((a, b) => a.chapter_order - b.chapter_order);
					const chapterIndex = chapter.findIndex(({ chapter_id }) => chapter_id === chapterId);
					const createChapterNav = (targetIndex) => targetIndex in chapter ? () => location.assign(`/pages/comic/page?comic_id=${comicId}&chapter_id=${chapter[targetIndex].chapter_id}`) : void 0;
					setState("manga", {
						onPrev: createChapterNav(chapterIndex - 1),
						onNext: createChapterNav(chapterIndex + 1)
					});
					return (await getPageData(comicId, chapterId)).page_url_hd;
				},
				handler: ({ setState }, { comicId, chapterId }) => {
					(async () => {
						try {
							const comments = await getZaiManHuaCommentList(comicId, chapterId);
							if (comments.length > 0) setState("manga", "commentList", comments);
						} catch (error) {
							helper.log.error(error);
						}
					})();
				}
			});
			break;
		}
		case "tw.manhuagui.com":
		case "m.manhuagui.com":
		case "www.mhgui.com":
		case "www.manhuagui.com": {
			if (!/\/comic\/\d+\/\d+\.html/u.test(location.pathname)) break;
			let comicInfo;
			try {
				const dataScript = helper.querySelectorAll("body > script:not([src])").find((script) => script.innerHTML.startsWith("window["));
				if (!dataScript) throw new Error(helper.t("site.changed_load_failed"));
				comicInfo = JSON.parse(eval(dataScript.innerHTML.slice(26)).match(/(?<=\()\{.+\}/u)[0]);
			} catch {
				core.toast.error(helper.t("site.changed_load_failed"));
				break;
			}
			helper.css`
        #smh-msg-box {
          z-index: 2147483647 !important;
        }
      `;
			const createChapterNav = (cid) => {
				if (cid === 0) return;
				const newUrl = location.pathname.replace(/(?<=\/)\d+(?=\.html)/u, `${cid}`);
				return () => location.assign(newUrl);
			};
			core.setup({
				name: "manhuagui",
				getImgList() {
					const sl = Object.entries(comicInfo.sl).map((attr) => `${attr[0]}=${attr[1]}`).join("&");
					if (comicInfo.files) return comicInfo.files.map((file) => `${unsafeWindow.pVars.manga.filePath}${file}?${sl}`);
					if (comicInfo.images) {
						const { origin } = new URL(helper.querySelector("#manga img").src);
						return comicInfo.images.map((url) => `${origin}${url}?${sl}`);
					}
					core.toast.error(helper.t("site.changed_load_failed"), { throw: true });
					return [];
				},
				onNext: () => createChapterNav(comicInfo.nextId),
				onPrev: () => createChapterNav(comicInfo.prevId)
			});
			break;
		}
		case "www.manhuaren.com":
		case "m.1kkk.com":
		case "www.1kkk.com":
		case "tel.dm5.com":
		case "en.dm5.com":
		case "cnc.dm5.com":
		case "www.dm5.cn":
		case "www.dm5.com": {
			if (!Reflect.has(unsafeWindow, "DM5_CID")) break;
			const imgNum = unsafeWindow.DM5_IMAGE_COUNT ?? unsafeWindow.imgsLen;
			if (!(Number.isSafeInteger(imgNum) && imgNum > 0)) {
				core.toast.error(helper.t("site.changed_load_failed"));
				break;
			}
			const getPageImg = async (i) => {
				const res = await unsafeWindow.$.ajax({
					type: "GET",
					url: "chapterfun.ashx",
					data: {
						cid: unsafeWindow.DM5_CID,
						page: i,
						key: unsafeWindow.$("#dm5_key").length > 0 ? unsafeWindow.$("#dm5_key").val() : "",
						language: 1,
						gtk: 6,
						_cid: unsafeWindow.DM5_CID,
						_mid: unsafeWindow.DM5_MID,
						_dt: unsafeWindow.DM5_VIEWSIGN_DT,
						_sign: unsafeWindow.DM5_VIEWSIGN
					}
				});
				return eval(res);
			};
			const getChapterNav = (pcSelector, mobileText) => helper.querySelectorClick(() => helper.querySelector(pcSelector) ?? helper.querySelectorAll(".view-bottom-bar a").find((e) => e.textContent?.includes(mobileText)));
			core.setup({
				name: "dm5",
				getImgList({ dynamicLoad }) {
					if (Array.isArray(unsafeWindow.newImgs) && unsafeWindow.newImgs.every(helper.isUrl)) return unsafeWindow.newImgs;
					return dynamicLoad(async (setImg) => {
						const imgList = /* @__PURE__ */ new Set();
						while (imgList.size < imgNum) for (const url of await getPageImg(imgList.size + 1)) {
							if (imgList.has(url)) continue;
							imgList.add(url);
							setImg(imgList.size - 1, url);
						}
					}, imgNum);
				},
				onPrev: () => getChapterNav(".logo_1", "上一章"),
				onNext: () => getChapterNav(".logo_2", "下一章"),
				onExit: (isEnd) => isEnd && helper.scrollIntoView(".postlist")
			});
			break;
		}
		case "www.mangabz.com":
		case "mangabz.com": {
			if (!Reflect.has(unsafeWindow, "MANGABZ_CID")) break;
			const imgNum = unsafeWindow.MANGABZ_IMAGE_COUNT ?? unsafeWindow.imgsLen;
			if (!(Number.isSafeInteger(imgNum) && imgNum > 0)) {
				core.toast.error(helper.t("site.changed_load_failed"));
				break;
			}
			const getPageImg = async (i) => {
				const res = await unsafeWindow.$.ajax({
					type: "GET",
					url: "chapterimage.ashx",
					data: {
						cid: unsafeWindow.MANGABZ_CID,
						page: i,
						key: "",
						_cid: unsafeWindow.MANGABZ_CID,
						_mid: unsafeWindow.MANGABZ_MID,
						_dt: unsafeWindow.MANGABZ_VIEWSIGN_DT,
						_sign: unsafeWindow.MANGABZ_VIEWSIGN
					}
				});
				return eval(res);
			};
			const getChapterNav = (pcSelector, mobileText) => helper.querySelectorClick(() => helper.querySelector(pcSelector) ?? helper.querySelectorAll(".bottom-bar-tool a").find((e) => e.textContent?.includes(mobileText)));
			core.setup({
				name: "mangabz",
				getImgList: ({ dynamicLoad }) => dynamicLoad(async (setImg) => {
					const imgList = /* @__PURE__ */ new Set();
					while (imgList.size < imgNum) for (const url of await getPageImg(imgList.size + 1)) {
						if (imgList.has(url)) continue;
						imgList.add(url);
						setImg(imgList.size - 1, url);
					}
				}, imgNum),
				onNext: () => getChapterNav("body > .container a[href^=\"/\"]:last-child", "下一"),
				onPrev: () => getChapterNav("body > .container a[href^=\"/\"]:first-child", "上一")
			});
			break;
		}
		case "komiic.com":
		case "komiic.cc": {
			const query = `
        query imagesByChapterId($chapterId: ID!) {
          imagesByChapterId(chapterId: $chapterId) {
            id
            kid
            height
            width
            __typename
          }
        }`;
			const getChapterNav = (text) => helper.querySelectorClick(".v-bottom-navigation__content button:not([disabled])", text);
			core.setup({
				name: "komiic",
				isMangaPage: () => {
					return /^\/comic\/(?<comicId>\d+)\/chapter\/(?<chapterId>\d+)\//u.exec(location.pathname)?.groups ?? false;
				},
				getImgList: async (_, { chapterId }) => {
					return (await core.request("/api/query", {
						method: "POST",
						responseType: "json",
						headers: { "content-type": "application/json" },
						data: JSON.stringify({
							operationName: "imagesByChapterId",
							variables: { chapterId },
							query
						})
					})).response.data.imagesByChapterId.map(({ kid }) => `/api/image/${kid}`);
				},
				onPrev: () => getChapterNav("上一"),
				onNext: () => getChapterNav("下一")
			});
			break;
		}
		case "8.twobili.com":
		case "a.twobili.com":
		case "articles.onemoreplace.tw":
		case "www.8comic.com": {
			if (!/^\/(?:online|ReadComic|comic)\//u.test(location.pathname)) break;
			request.downloadImgHeaders.Referer = "https://www.8comic.com/";
			const getImgList = () => Array.from(unsafeWindow.xx.matchAll(/(?<= s=").+?(?=")/gu), ([text]) => decodeURIComponent(text));
			core.setup({
				name: "8comic",
				getImgList,
				onNext: () => helper.querySelectorClick("#nextvol"),
				onPrev: () => helper.querySelectorClick("#prevvol")
			});
			break;
		}
		case "www.wn09.cfd":
		case "www.wn09.shop":
		case "www.wnacg.com":
		case "wnacg.com": {
			const buttonDom = helper.querySelector("#bodywrap a.btn");
			if (buttonDom) {
				buttonDom.style.setProperty("background-color", "#607d8b");
				buttonDom.style.setProperty("background-image", "none");
			}
			const match = /\/photos-(?<type>slist|slide|list)-aid-(?<id>\d+)/u.exec(location.pathname)?.groups;
			if (!match?.type || !match?.id || match?.type === "index") break;
			const getImgList = unsafeWindow.imglist ? () => unsafeWindow.imglist.filter(({ caption }) => caption !== "喜歡紳士漫畫的同學請加入收藏哦！").map(({ url }) => url) : async () => {
				const res = await core.request(`/photos-item-aid-${match.id}.html`);
				const pageUrl = /"page_url":(?<pageUrl>\[.+\]),/u.exec(res.responseText)?.groups.pageUrl;
				if (!pageUrl) throw new Error(helper.t("site.changed_load_failed"));
				return eval(pageUrl);
			};
			core.setup({
				name: "wnacg",
				getImgList
			});
			break;
		}
		case "18comic.ink":
		case "jmcomic-zzz.one":
		case "jmcomic-zzz.org":
		case "comic18j-rita.net":
		case "comic18j-rita.club":
		case "comic18j-bibi.cc":
		case "18comic.org":
		case "18comic.vip":
			selfImport("site/jm");
			break;
		case "noy1.top":
			core.setup({
				name: "NoyAcg",
				isMangaPage: () => location.hash.startsWith("#/read/") && { id: location.hash },
				async getImgList() {
					const [, , id] = location.hash.split("/");
					const [cdn] = (await helper.wait(() => helper.querySelector(".lazy-load-image-background img"))).src.split(id);
					const imgNum = await helper.wait(() => helper.querySelectorAll(".lazy-load-image-background").length);
					return helper.range(imgNum, (i) => `${cdn}${id}/${i + 1}.webp`);
				}
			});
			break;
		case "www.relamanhua.org":
		case "www.manga2024.com":
		case "www.2024manga.com":
			if (!location.pathname.includes("/chapter/")) break;
			if (!document.querySelector(".disData[contentkey]")) {
				core.toast.error(helper.t("site.changed_load_failed"));
				break;
			}
			core.setup({
				name: "relamanhua",
				getImgList: () => userscript_copyApi.getImglistByHtml(),
				onNext: () => helper.querySelectorClick(".comicContent-next a:not(.prev-null)"),
				onPrev: () => helper.querySelectorClick(".comicContent-prev:not(.index,.list) a:not(.prev-null)")
			});
			break;
		case "hanime1.me":
			if (!location.pathname.startsWith("/comic/")) break;
			core.setup({
				name: "hanime1",
				getImgList: async () => {
					const downloadDom = await helper.wait(() => helper.querySelector(".comics-metadata-margin-top a:has(span.material-icons)"));
					const id = /\/g\/(?<id>\d+)\//u.exec(downloadDom.href)?.groups?.id;
					if (!id) throw new Error(helper.t("site.changed_load_failed"));
					const data = await getNhentaiData(id);
					return toImgList(data);
				}
			});
			break;
		case "hitomi.la":
			core.setup({
				name: "hitomi",
				isMangaPage: () => helper.wait(() => unsafeWindow.galleryinfo && Reflect.has(unsafeWindow.galleryinfo, "files") && unsafeWindow.galleryinfo.type !== "anime", 5e3),
				getImgList: () => unsafeWindow.galleryinfo.files.map((img) => unsafeWindow.url_from_url_from_hash(unsafeWindow.galleryinfo.id, img, "webp")),
				initOptions: { defaultOption: { imgRecognition: { enabled: true } } }
			});
			break;
		case "hdoujin.org": {
			const clearance = localStorage.getItem("clearance");
			if (!clearance) throw new Error(helper.t("site.changed_load_failed"));
			const api = async (url, details) => {
				return (await core.request(`https://api.hdoujin.org/books${url}?crt=${clearance}`, {
					fetch: true,
					responseType: "json",
					...details
				})).response;
			};
			core.setup({
				name: "hdoujin",
				isMangaPage: () => {
					const match = /\/g\/(?<galleryId>\d+)\/(?<galleryKey>.+?)(?:\/read\/\d+)?$/u.exec(location.pathname)?.groups;
					return match ? {
						type: "manga",
						...match
					} : false;
				},
				getImgList: async ({ dynamicLazyLoad }, { galleryId, galleryKey }) => {
					const { data } = await api(`/detail/${galleryId}/${galleryKey}`, { method: "POST" });
					const [[size]] = Object.entries(data).filter(([, { id, key }]) => id && key).toSorted(([a], [b]) => {
						if (a === "0") return -1;
						if (b === "0") return 1;
						return Number(b) - Number(a);
					});
					const { id: dataId, key: dataKey } = data[size];
					const { base, entries } = await api(`/data/${galleryId}/${galleryKey}/${dataId}/${dataKey}/${size}`);
					return dynamicLazyLoad({
						length: entries.length,
						loadImg: async (i) => {
							const res = await core.request(`${base}${entries[i].path}`, {
								cookie: document.cookie,
								headers: {
									Referer: "https://hdoujin.org/",
									Origin: "https://hdoujin.org",
									"sec-fetch-dest": "empty",
									"sec-fetch-mode": "cors",
									"sec-fetch-site": "cross-site"
								},
								responseType: "blob",
								fetch: false
							});
							return URL.createObjectURL(res.response);
						}
					});
				}
			});
			break;
		}
		case "shupogaki.moe":
		case "hoshino.one":
		case "niyaniya.moe": {
			const downloadImg = (url) => new Promise((resolve) => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = "blob";
				xhr.open("GET", url);
				xhr.onload = () => {
					resolve(URL.createObjectURL(xhr.response));
				};
				xhr.send();
			});
			const crt = localStorage.getItem("clearance");
			core.setup({
				name: "schale",
				isMangaPage: () => {
					return /\/g\/(?<galleryId>\d+)\/(?<galleryKey>.+?)(?:\/read\/\d+)?$/u.exec(location.pathname)?.groups ?? false;
				},
				async getImgList({ dynamicLazyLoad }, { galleryId, galleryKey }) {
					const detailRes = await core.request(`https://api.schale.network/books/detail/${galleryId}/${galleryKey}?crt=${crt}`, {
						fetch: true,
						responseType: "json",
						method: "POST"
					});
					const [[w, { id, key }]] = Object.entries(detailRes.response.data).filter(([, data]) => data.id && data.key).toSorted(([, a], [, b]) => b.size - a.size);
					const { base, entries } = (await core.request(`https://api.schale.network/books/data/${galleryId}/${galleryKey}/${id}/${key}/${w}?crt=${crt}`, {
						fetch: true,
						responseType: "json"
					})).response;
					const { length } = entries;
					const loadImg = async (i) => {
						const { path, dimensions } = entries[i];
						const startTime = performance.now();
						const url = await downloadImg(`${base}${path}?w=${dimensions[0]}`);
						await helper.sleep(500 - (performance.now() - startTime));
						return url;
					};
					return dynamicLazyLoad({
						loadImg,
						length,
						concurrency: 1
					});
				}
			});
			break;
		}
		case "nude-moon.org":
			if (/^\/\d+-/u.exec(location.pathname) === null) break;
			components_Manga.listenHotkey({
				scroll_right: () => unsafeWindow.nextImg(),
				scroll_left: () => unsafeWindow.backImg()
			});
			core.setup({
				name: "nude-moon",
				initOptions: {
					autoShow: false,
					defaultOption: { pageNum: 1 }
				},
				async getImgList() {
					if (unsafeWindow.images) return unsafeWindow.images.map((e) => e.src);
					const url = location.href.replace(/(?<slug>\/[^/-]+)(?<dash>-)/u, "$<slug>-online-");
					const { response: html } = await core.request(url);
					const imgList = Array.from(html.matchAll(/images\[\d+\]\.src = '(?<src>.+?)';/gu), ({ groups: { src } }) => `https://nude-moon.org${src}`);
					if (imgList.length === 0) throw new Error(helper.t("site.changed_load_failed"));
					return imgList;
				}
			});
			break;
		case "hentaizap.com":
		case "imhentai.xxx":
		case "hentaiera.com":
		case "hentaienvy.com": {
			const imgDom = helper.querySelector(":is(#thumbs_box, #thumbs_gallery_div, #append_thumbs, #ap_thumbs) img[data-src]");
			if (!imgDom) break;
			const imgUrl = imgDom.dataset.src;
			if (!imgUrl || !unsafeWindow.g_th) throw new Error(helper.t("site.changed_load_failed"));
			const baseUrl = imgUrl.replace(/\/\dt.[a-z]+$/u, "");
			core.setup({
				name: "HentaiEnvy",
				getImgList() {
					const imgList = [];
					for (const [i, th] of Object.entries(unsafeWindow.g_th)) {
						const [type, w, h] = th.split(",");
						imgList[Number(i) - 1] = {
							src: `${baseUrl}/${i}.${helper.fileType[type]}`,
							width: Number(w),
							height: Number(h)
						};
					}
					return imgList;
				}
			});
			break;
		}
		case "mangadex.org":
			core.setup({
				name: "mangadex",
				isMangaPage: () => /^\/chapter\/(?<id>[^/]+)/u.exec(location.pathname)?.groups,
				async getImgList() {
					const chapter_id = location.pathname.split("/").at(2);
					const { response: { baseUrl, chapter: { data, hash } } } = await core.request(`https://api.mangadex.org/at-home/server/${chapter_id}?forcePort443=false`, { responseType: "json" });
					return data.map((e) => `${baseUrl}/data/${hash}/${e}`);
				},
				onPrev: () => helper.querySelectorClick(`#chapter-selector > a[href^="/chapter/"]:nth-of-type(1)`),
				onNext: () => helper.querySelectorClick(`#chapter-selector > a[href^="/chapter/"]:nth-of-type(2)`)
			});
			break;
		case "nicomanga.com": {
			const getImgList = () => unsafeWindow.chapterImages;
			core.setup({
				name: "welovemanga",
				isMangaPage: () => helper.wait(() => getImgList()?.length > 0),
				getImgList,
				onNext: () => helper.querySelectorClick(".next-chapter"),
				onPrev: () => helper.querySelectorClick(".prev-chapter")
			});
			break;
		}
		case "weloma.art":
		case "love4u.net": {
			if (!helper.querySelector("#chapter-images img")) break;
			const getImgUrl = (e) => {
				const src = e.dataset.srcset || e.dataset.original || e.dataset.src || e.src;
				if (src && !src.endsWith(".gif")) return src.trim();
				if (e.dataset.img) return atob(e.dataset.img);
			};
			const getImgList = () => helper.querySelectorAll("#chapter-images img").map(getImgUrl).filter(Boolean);
			core.setup({
				name: "welovemanga",
				getImgList,
				onNext: () => helper.querySelectorClick(".rd_top-right.next:not(.disabled)"),
				onPrev: () => helper.querySelectorClick(".rd_top-left.prev:not(.disabled)")
			});
			break;
		}
		case "klz9.com": {
			if (!location.pathname.includes("-chapter-")) break;
			const getNavBtn = (index) => helper.querySelectorAll("main button.flex-1")[index];
			const handlePrevNext = (index) => {
				const btn = getNavBtn(index);
				return btn && !btn.disabled ? () => btn.click() : void 0;
			};
			core.setupSimple({
				name: "klz9",
				selector: "main img:not(a img)",
				isMangaPage: async () => {
					if (!location.pathname.includes("-chapter-")) return false;
					await helper.wait(() => helper.querySelector("main img:not(a img)"));
					return { id: location.pathname };
				},
				onPrev: () => handlePrevNext(0),
				onNext: () => handlePrevNext(1)
			});
			break;
		}
		case "pawchive.pw":
		case "kemono.cr":
		case "kemono.su":
		case "kemono.party":
			selfImport("site/kemono");
			break;
		case "nekohouse.su":
			if (!location.pathname.includes("/post/")) break;
			core.setup({
				name: "nekohouse",
				getImgList: () => helper.querySelectorAll(".fileThumb").map((e) => e.getAttribute("href")),
				initOptions: {
					autoShow: false,
					defaultOption: { pageNum: 1 }
				}
			});
			break;
		case "www.pixiv.net":
			selfImport("site/pixiv");
			break;
		case "comic.hypergryph.com": {
			const apiUrl = () => {
				return `https://comic.hypergryph.com/api${/\/comic\/.+/u.exec(location.pathname)?.[0] ?? ""}`;
			};
			const loadImg = async (i) => {
				const res = await core.request(`${apiUrl()}/page?pageNum=${i + 1}`);
				return JSON.parse(res.responseText).data.url;
			};
			const handlePrevNext = (text) => helper.querySelectorClick("footer button:not([disabled]) a", text);
			core.setup({
				name: "terraHistoricus",
				isMangaPage: () => location.href.includes("episode") && { id: location.href },
				async getImgList({ dynamicLazyLoad }) {
					const pageList = (await core.request(apiUrl(), { responseType: "json" })).response.data.pageInfos;
					if (pageList.length === 0 && location.pathname.includes("episode")) throw new Error("获取图片列表时出错");
					return dynamicLazyLoad({
						loadImg,
						length: pageList.length
					});
				},
				onPrev: () => handlePrevNext("上一"),
				onNext: () => handlePrevNext("下一")
			});
			break;
		}
		case "postimg.cc": {
			const domList = helper.querySelectorAll("#thumb-list [data-hotlink]");
			if (domList.length <= 1) break;
			core.setup({
				name: "postimg",
				getImgList: () => domList.map((e) => `https://i.postimg.cc/${e.dataset.hotlink}/${e.dataset.name}.${e.dataset.ext}`)
			});
			break;
		}
		case "sai-zen-sen.jp":
			switch (/\/[^/]+\/[^/]+\//u.exec(location.pathname)?.[0]) {
				case "/special/4pages-comics/":
				case "/works/comics/":
					core.setup({
						name: "sai-zen-sen",
						getImgList: () => Object.values(unsafeWindow.B.Package.Manifest.items).map(({ href }) => href).filter(Boolean).map((path) => `${unsafeWindow.B.Path}/${path}`),
						onPrev: () => helper.querySelectorClick("ul.volumes > li:nth-child(2) > a[href]"),
						onNext: () => helper.querySelectorClick("ul.volumes > li:nth-child(3) > a[href]")
					});
					break;
				case "/comics/twi4/": core.setup({
					name: "sai-zen-sen",
					getImgList: () => unsafeWindow.t4.Meta.Items.map(({ ImageFileName }) => `${unsafeWindow.t4.GA.Gate.x_directory}works/${ImageFileName}`)
				});
			}
			break;
		case "geinou-nude.com": {
			const imgList = helper.querySelectorAll("main img.size-medium").map((e) => {
				const src = e.dataset.src ?? "";
				const res = /-(?<w>\d+)x(?<h>\d+)\.[a-z]+$/iu.exec(src)?.groups;
				if (!res) return src;
				return {
					src,
					width: Number(res.w),
					height: Number(res.h)
				};
			});
			if (imgList.length === 0) break;
			core.setup({
				name: "geinou-nude",
				getImgList: () => imgList
			});
			break;
		}
		case "comic-read.pages.dev":
			unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
			unsafeWindow.toast = core.toast;
			break;
		default:
			selfImport("site/selfhosted");
			(async () => {
				if (await GM.getValue(location.hostname) !== void 0) return helper.requestIdleCallback(userscript_otherSite.otherSite);
				await GM.registerMenuCommand(((lang) => {
					switch (lang) {
						case "en": return "Enter simple reading mode";
						case "ru": return "Включить простой режим чтения";
						default: return "使用简易阅读模式";
					}
				})(await helper_languages.getInitLang()), () => userscript_otherSite.otherSite());
			})();
	}
} catch (error) {
	helper.log.error(error);
}
//#endregion
