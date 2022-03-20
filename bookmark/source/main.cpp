#include <emscripten/fetch.h>
#include <emscripten/val.h>
#include <iostream>
#include "frame.h"

using emscripten::val;

constexpr const char* cdn = "https://cdn.ra3.us/-/query";

Frame* frame;

using emscripten::val;

void downloadSucceeded(emscripten_fetch_t* fetch) {
	val parsed = val::global("JSON").call<val>("parse", val(std::string(fetch->data, fetch->numBytes)));

	// The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
	emscripten_fetch_close(fetch);  // Free data associated with the fetch.

	if (fetch->status >= 300) {
		std::string message = parsed["message"].as<std::string>();

		if (message == "No proxy available") {
			frame->load_html("<h1>No proxy available</h1>");
		} else {
			std::cerr << message << std::endl;
		}

		return;
	}

	frame->load("https://" + parsed["host"].as<std::string>());
}

void downloadFailed(emscripten_fetch_t* fetch) {
	std::cout << "Downloading " << fetch->url << " failed, HTTP failure status code: " << fetch->status << std::endl;
	emscripten_fetch_close(fetch);  // Also free data on failure.
}

int main() {
	frame = new Frame();

	frame->load_html("Finding the best proxy...");

	emscripten_fetch_attr_t attr;
	emscripten_fetch_attr_init(&attr);
	const char* method = "GET";
	std::copy(method, method + sizeof(method), attr.requestMethod);
	attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attr.onsuccess = downloadSucceeded;
	attr.onerror = downloadFailed;
	attr.withCredentials = true;
	emscripten_fetch(&attr, cdn);

	return 0;
}