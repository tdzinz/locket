// Locket video gate patch - chay trong Shadowrocket
// Sua Firebase Remote Config: feature_gates.longer_video: disabled -> subscriber
(function () {
  var body;
  try {
    body = JSON.parse($response.body);
  } catch (e) {
    return $done({});
  }

  var entries = body.entries || {};
  var changed = false;

  for (var key in entries) {
    var item = entries[key];

    // gia tri la chuoi (dung dinh dang Firebase RC tra ve)
    if (typeof item === "string") {
      if (item.indexOf("longer_video") >= 0 && item.indexOf('"disabled"') >= 0) {
        entries[key] = item.replace('"longer_video":"disabled"', '"longer_video":"subscriber"');
        changed = true;
      }
      continue;
    }

    // truong hop gia tri la object {value: ...}
    if (item && typeof item === "object") {
      var val = String(item.value || "");
      if (/longer_video|long_video|video_?duration|max_video/i.test(key)) {
        item.value = "subscriber";
        changed = true;
      } else if (/longer_video/.test(val)) {
        item.value = val.replace('"disabled"', '"subscriber"');
        changed = true;
      }
    }
  }

  if (!changed) return $done({});
  body.entries = entries;
  $done({ body: JSON.stringify(body) });
})();
