#include <emscripten/fetch.h>
#include <emscripten/val.h>
#include <iostream>
#include "frame.h"

using emscripten::val;

constexpr const char* cdn = "https://cdn.ra3.us/-/query";

Frame* frame;

using emscripten::val;

void download_succeeded(emscripten_fetch_t* fetch) {
	val parsed = val::global("JSON").call<val>("parse", val(std::string(fetch->data, fetch->numBytes)));

	// The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
	emscripten_fetch_close(fetch);  // Free data associated with the fetch.

	if (fetch->status >= 300) {
		
	}

	frame->load("https://" + parsed["host"].as<std::string>());
}

void download_failed(emscripten_fetch_t* fetch) {
	val parsed = val::global("JSON").call<val>("parse", val(std::string(fetch->data, fetch->numBytes)));

	emscripten_fetch_close(fetch);

	frame->display_error("Unable to find a proxy.", parsed["message"].as<std::string>(), parsed["code"].as<std::string>());
}

int main() {
	frame = new Frame();

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

	return 0;
}