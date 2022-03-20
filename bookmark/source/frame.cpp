#include "frame.h"
#include <emscripten.h>
#include <chrono>
#include "date.h"

using emscripten::val;

// clang-format off
EM_JS(void, register_listener, (Frame* pointer), {
	const {frame} = Module;
	let ping = false;
	let pong = false;

	window.addEventListener('message', ({ data }) => {
		if(data === 'ip-client-pong' && ping){
			pong = true;
			ping = false;
			Module.callback(pointer, true);
		}
	});

	frame.addEventListener('load', event => {
		ping = true;
		pong = false;
		frame.postMessage('ip-client-ping');

		setTimeout(() => {
			if(!pong){
				ping = false;
				Module.callback(pointer, false);
			}
		}, 8e3);
	});
});
// clang-format on

EM_JS(emscripten::EM_VAL, get_module_handle, (), {
	return Emval.toHandle(Module);
});

void callback(val _frame,  bool loaded) {
	Frame* frame = reinterpret_cast<Frame*>(_frame.as<uint32_t>());

	frame->on_error();
}

EMSCRIPTEN_BINDINGS(frame) {
	emscripten::function("callback", &callback);
}

Frame::Frame(std::function<void()> _on_error)
    : document(val::global("document"))
    , frame(document.call<val>("createElement", val("iframe")))
    , on_error(_on_error) {
	val module = val::take_ownership(get_module_handle());

	module.set("frame", frame);
	register_listener(this);
	module.delete_("frame");

	val style = frame["style"];

	style.set("display", "block");
	style.set("position", "absolute");
	style.set("width", "100%");
	style.set("height", "100%");
	style.set("background", "#ffffff");
	style.set("border", "none");

	document["body"].call<void>("remove");
	document["documentElement"].call<void>("append", frame);
}

void Frame::load(std::string url) {
	frame.call<void>("removeAttribute", val("srcdoc"));
	frame.call<void>("setAttribute", val("src"), val(url));
}

void Frame::load_html(std::string html) {
	frame.call<void>("setAttribute", val("srcdoc"), val(html));
	frame.call<void>("removeAttribute", val("src"));
}

void Frame::display_error(std::string title, std::string message, std::string code) {
	std::string time = date::format("%D %T %Z\n", floor<std::chrono::milliseconds>(std::chrono::system_clock::now()));

	load_html(R"(<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1"/>
	</head>
	<body>
		<h1>)" +
	          title + R"(</h1>
		<hr />
		<p>)" +
	          message + R"(</p>
		<p>Try again later. If this error still occurs, contact this service's administrator and mention the details below:</p>
		<p>
		Error Code: )" +
	          code + R"(<br />
		Time: )" +
	          time + R"(
		</p>
	</body>
</html>)");
}