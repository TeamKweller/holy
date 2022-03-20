#include "fetch.h"

struct FetchData {
	std::function<void(emscripten_fetch_t*)> then;
	std::function<void(emscripten_fetch_t*)> except;
};

void fetch_error(emscripten_fetch_t* response) {
	FetchData* data = reinterpret_cast<FetchData*>(response->userData);
	if (data->except) {
		data->except(response);
	}
	delete data;
}

void fetch_success(emscripten_fetch_t* response) {
	FetchData* data = reinterpret_cast<FetchData*>(response->userData);
	if (data->then) {
		data->then(response);
	}
	delete data;
}

void fetch(std::string url, emscripten_fetch_attr_t attribute, std::function<void(emscripten_fetch_t*)> then, std::function<void(emscripten_fetch_t*)> except) {
	FetchData* data = new FetchData();
	data->then = then;
	data->except = except;
	attribute.onerror = fetch_error;
	attribute.onsuccess = fetch_success;
	attribute.userData = reinterpret_cast<void*>(data);
	emscripten_fetch(&attribute, url.c_str());
}

emscripten_fetch_attr_t new_fetch_attribute(){
	emscripten_fetch_attr_t attribute;
	emscripten_fetch_attr_init(&attribute);
	return attribute;
}