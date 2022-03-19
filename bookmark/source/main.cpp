#include <iostream>
#include <emscripten/fetch.h>

void downloadSucceeded(emscripten_fetch_t *fetch) {
	std::cout << "Finished downloading " << fetch->numBytes << " bytes from URL " << fetch->url << "." << std::endl;
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
	std::string("GET").copy(attr.requestMethod, sizeof(attr.requestMethod), 0);
	attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
	attr.onsuccess = downloadSucceeded;
	attr.onerror = downloadFailed;
	emscripten_fetch(&attr, "myfile.dat");
	
	std::cout << "Test" << std::endl;

	return 0;
}