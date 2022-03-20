#include <emscripten/val.h>
#include <iostream>
#include "fetch.h"
#include "frame.h"

using emscripten::val;

#ifndef NDEBUG
constexpr const char* cdn = "http://127.0.0.1:4000/query";
#else
constexpr const char* cdn = "https://cdn.ra3.us/-/query";
#endif

Frame* frame;

using emscripten::val;

EM_JS(emscripten::EM_VAL, json_parse, (const char* data, size_t length), {
	const string = UTF8ToString(data, length);

	try {
		const parsed = JSON.parse(string);
		return Emval.toHandle(parsed);
	} catch (error) {
		return Emval.toHandle(undefined);
	}
});

std::string verbose_error_code(emscripten_fetch_t* response, val object){
	if (object.hasOwnProperty("code")) {
		return object["code"].as<std::string>();
	} else if (object.hasOwnProperty("error")) {
		return object["error"].as<std::string>();
	} else {
		return "NET_UNKNOWN_" + std::to_string(response->status);
	}
}

void fetch_proxy() {
	frame->load_html("<h3>Finding the best proxy...</h3>");

	emscripten_fetch_attr_t attribute = new_fetch_attribute();
	strcpy(attribute.requestMethod, "GET");
	attribute.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attribute.withCredentials = true;

	fetch(cdn, attribute, [](emscripten_fetch_t* response) {
		val parsed = val::global("JSON").call<val>("parse", val(std::string(response->data, response->numBytes)));

		if (response->status >= 300) {
			frame->display_error("Unable to find a proxy.", parsed["message"].as<std::string>(), verbose_error_code(response, parsed));
		}else{
			frame->load("https://" + parsed["host"].as<std::string>());
		}

		emscripten_fetch_close(response);
	}, [](emscripten_fetch_t* response) {
		frame->display_error("Unable to find a proxy.", "An unknown network error occured", "NET_UNKNOWN_" + std::to_string(response->status));

		emscripten_fetch_close(response);
	});
}

void report_proxy() {
	frame->load_html("<h3>Proxy didn't load! Requesting new one...</h3>");
	emscripten_fetch_attr_t attribute = new_fetch_attribute();
	strcpy(attribute.requestMethod, "DELETE");
	attribute.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attribute.withCredentials = true;
	fetch(cdn, attribute, [](emscripten_fetch_t* response){
		if (response->status >= 300) {
			val parsed = val::take_ownership(json_parse(response->data, response->numBytes));
			frame->display_error("Unable to request new proxy.", parsed["message"].as<std::string>(), verbose_error_code(response, parsed));
		}else{
			fetch_proxy();
		}

		emscripten_fetch_close(response);
	}, [](emscripten_fetch_t* response){
		frame->display_error("Unable to request new proxy.", "An unknown network error occured", "NET_UNKNOWN_" + std::to_string(response->status));

		emscripten_fetch_close(response);
	});
}

int main() {
	frame = new Frame([](bool loaded) {
		if (!loaded) {
			std::cerr << "didn't load but wont report" << std::endl;
			// report_proxy();
		}
	});

	fetch_proxy();

	return 0;
}