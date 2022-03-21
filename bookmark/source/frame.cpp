#include "frame.h"
#include <emscripten.h>
#include <chrono>
#include "date.h"
#include "fetch.h"
#include "main.h"

using emscripten::val;
using namespace std::string_literals;

// clang-format off
EM_JS(void, register_listener, (Frame* pointer, const char* _property, size_t _property_length), {
	const property = UTF8ToString(_property, _property_length);
	const frame = Module[property];

	frame.addEventListener('load', event => {
		if(!frame.hasAttribute('src')){
			return;
		}

		setTimeout(() => {
			Module.callback(pointer);
		}, 2e3);
	});
});
// clang-format on

EM_JS(emscripten::EM_VAL, get_module_handle, (), {
	return Emval.toHandle(Module);
});

void callback(val _frame) {
	reinterpret_cast<Frame*>(_frame.as<uint32_t>())->callback();
}

EMSCRIPTEN_BINDINGS(frame) {
	emscripten::function("callback", &callback);
}

void Frame::callback(){
	emscripten_fetch_attr_t attribute = new_fetch_attribute();
	strcpy(attribute.requestMethod, "GET");
	attribute.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attribute.withCredentials = true;
	
	fetch(queryCDN + "/tracker?id="s + id, attribute, [&](emscripten_fetch_t* response){
		val parsed = val::global("JSON").call<val>("parse", val(std::string(response->data, response->numBytes)));

		bool accessed = parsed["accessed"].as<bool>();

		load_callback(accessed);
	});
}

Frame::Frame(std::function<void(bool)> _load_callback)
    : document(val::global("document"))
    , frame(document.call<val>("createElement", val("iframe")))
    , load_callback(_load_callback) {
	val module = val::take_ownership(get_module_handle());

	std::string property = "frame";
	module.set(property, frame);
	register_listener(this, property.data(), property.size());
	module.delete_(property);

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

void Frame::load(std::string host) {
	emscripten_fetch_attr_t attribute = new_fetch_attribute();
	strcpy(attribute.requestMethod, "POST");
	attribute.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attribute.withCredentials = true;

	fetch(queryCDN + "/tracker"s, attribute, [&,host](emscripten_fetch_t* response){
		id = std::string(response->data, response->numBytes);
		std::string url = "https://" + host + "/?id=" + id;
	
		frame.call<void>("setAttribute", val("src"), val(url));
	});

	frame.call<void>("removeAttribute", val("src"));
	frame.call<void>("removeAttribute", val("srcdoc"));
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