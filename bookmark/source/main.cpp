#include <emscripten/fetch.h>
#include <emscripten/val.h>
#include <iostream>
#include "frame.h"

using emscripten::val;

#ifndef NDEBUG
constexpr const char* cdn = "http://127.0.0.1:4000/query";
#else
constexpr const char* cdn = "https://cdn.ra3.us/-/query";
#endif

Frame* frame;

using emscripten::val;

void download_succeeded(emscripten_fetch_t* fetch) {
	val parsed = val::global("JSON").call<val>("parse", val(std::string(fetch->data, fetch->numBytes)));

	// The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
	emscripten_fetch_close(fetch);  // Free data associated with the fetch.

	frame->load("https://" + parsed["host"].as<std::string>());
}

EM_JS(emscripten::EM_VAL, json_parse, (const char* data, size_t length), {
	const string = UTF8ToString(data, length);

	try {
		const parsed = JSON.parse(string);
		return Emval.toHandle(parsed);
	} catch (error) {
		return Emval.toHandle(undefined);
	}
});

void download_failed(emscripten_fetch_t* fetch) {
	val parsed = val::take_ownership(json_parse(fetch->data, fetch->numBytes));

	if (parsed.isUndefined()) {
		frame->display_error("Unable to find a proxy.", "An unknown network error occured", "NET_UNKNOWN_" + std::to_string(fetch->status));
	} else {
		frame->display_error("Unable to find a proxy.", parsed["message"].as<std::string>(), parsed["code"].as<std::string>());
	}

	emscripten_fetch_close(fetch);
}

void fetch() {
	frame->load_html("<h3>Finding the best proxy...</h3>");

	emscripten_fetch_attr_t attr;
	emscripten_fetch_attr_init(&attr);
	const char* method = "GET";
	std::copy(method, method + sizeof(method), attr.requestMethod);
	attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attr.onsuccess = download_succeeded;
	attr.onerror = download_failed;
	attr.withCredentials = true;
	emscripten_fetch(&attr, cdn);
}

int main() {
	frame = new Frame([]() {
		std::cerr << "ERROR " << std::endl;
	});

	fetch();

	return 0;
}