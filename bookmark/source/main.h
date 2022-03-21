#pragma once

#ifdef _DEBUG
constexpr const char* queryCDN = "http://127.0.0.1:4000";
#else
constexpr const char* queryCDN = "https://cdn.ra3.us/-";
#endif