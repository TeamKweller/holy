#include "frame.h"
#include <iostream>
#include <emscripten.h>

using emscripten::val;

EM_JS(void, register_listener, (Frame* pointer), {
	const { frame } = Module;
	Module.callback(pointer);
});

EM_JS(emscripten::EM_VAL, get_module_handle, (), {
	return Emval.toHandle(Module);
});

void callback(val _frame){
	Frame* frame = reinterpret_cast<Frame*>(_frame.as<uint32_t>());
	
	frame->on_error();
}

void Frame::on_error(){
	std::cout << "on error" << std::endl;
}

EMSCRIPTEN_BINDINGS(frame) {
	emscripten::function("callback", &callback, emscripten::allow_raw_pointers());
}

Frame::Frame()
    : document(val::global("document"))
    , frame(document.call<val>("createElement", val("iframe"))) {
	
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