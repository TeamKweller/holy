#include <iostream>
#include <emscripten/fetch.h>
#include <emscripten/bind.h>

constexpr const char* cdn = "https://cdn.ra3.us/-/query";

void downloadSucceeded(emscripten_fetch_t *fetch) {
	std::cout << std::string(fetch->data, fetch->numBytes) << std::endl;
	// The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
	emscripten_fetch_close(fetch); // Free data associated with the fetch.
}

void downloadFailed(emscripten_fetch_t *fetch) {
	std::cout << "Downloading " << fetch->url << " failed, HTTP failuree status code: " << fetch->status << std::endl;
	emscripten_fetch_close(fetch); // Also free data on failure.
}

int main() {
	emscripten_fetch_attr_t attr;
	emscripten_fetch_attr_init(&attr);
	const char* method = "GET";
	std::copy(method, method + sizeof(method), attr.requestMethod);
	attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attr.onsuccess = downloadSucceeded;
	attr.onerror = downloadFailed;
	attr.withCredentials = true;
	emscripten_fetch(&attr, cdn);
	
	std::cout << "Test 12" << std::endl;

	return 0;
}