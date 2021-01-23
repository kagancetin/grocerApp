let quantityOnFocus = (el) => {
  let listNode = document.getElementById(el.getAttribute("list"));
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/getQuantityTypes", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let responseData = JSON.parse(this.response);
      var template = '<option value="~id~">';
      listNode.innerHTML = "";
      responseData.forEach((item) => {
        listNode.insertAdjacentHTML(
          "beforeend",
          template.replace(/~id~/g, item)
        );
      });
    }
  };
  xhr.send();
};

let priceOnChange = (el) => {
  p = parseFloat(el.value);
  el.value = p.toFixed(2);
};

let checkRequired = (el = false) => {
  let requiredInputs;
  if (el) {
    requiredInputs = el.querySelectorAll(".required");
  } else {
    requiredInputs = document.querySelectorAll(".required");
  }
  let requiredError = [];
  requiredInputs.forEach((item) => {
    if (item.value == "") {
      requiredError.push(item);
      if (item.classList.contains("border") == false) {
        item.classList.add("border");
        item.classList.add("border-danger");
      }
    } else {
      if (item.classList.contains("border")) {
        item.classList.remove("border");
        item.classList.remove("border-danger");
      }
    }
  });
  return requiredError;
};

let searchProductByBarcodeOnkeyup = (e, callback) => {
  if (e.value != "") {
    let data = {
      barcode: e.value,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/searchProductByBarcode", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function (event) {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        if (this.response == "false") {
          callback(false);
        } else {
          let responseData = JSON.parse(this.response);
          if (responseData) {
            callback(responseData);
          }
        }
      }
    };
    xhr.send(JSON.stringify(data));
  }
};

let searchProductByShortcutOnkeyup = (e) => {
  let data = {
    shortcut: e.value,
  };
  let existShortcut = e.getAttribute("data-exist-shortcut");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/searchProductByShortcut", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function (event) {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      if (this.response == "false") {
        document.getElementById("shortcutProductButtonSubmit").disabled = false;
      } else {
        let responseData = JSON.parse(this.response);
        if (responseData) {
          if (responseData.shortcut != existShortcut) {
            toastr.warning(
              "Kısayol tuşu zaten " +
                responseData.name +
                " ürünü ile tanımlanmıştır",
              "Dikkat!"
            );
            document.getElementById(
              "shortcutProductButtonSubmit"
            ).disabled = true;
          } else {
            document.getElementById(
              "shortcutProductButtonSubmit"
            ).disabled = false;
          }
        }
      }
    }
  };
  xhr.send(JSON.stringify(data));
  if (data.shortcut == "") {
    document.getElementById("shortcutProductButtonSubmit").disabled = false;
  }
};

let clearBarcode = () => {
  document.getElementById("barcode").value = "";
  document.getElementById("barcode").focus();
};
