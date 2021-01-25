////**********  ADD PRODUCT  ****************///
let submitAddProduct = (e) => {
  e.preventDefault();
  let requiredError = checkRequired(e.target);
  if (requiredError.length > 0) {
    toastr.warning("Renkli alanlar boş bırakılamaz!", "Dikkat!");
  } else {
    let postData = $("#" + e.target.id).serialize();
    let action = $("#" + e.target.id).attr("action");

    $.post(action, postData, (response) => {
      if (response) {
        toastr.success(
          response.name + " ürünü başarıyla eklenmiştir",
          "Başarılı!"
        );
        closeModal("productAddModal");
      } else {
        toastr.error(
          "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyiniz",
          "Hata!"
        );
        closeModal("productAddModal");
      }
    });
  }
};

let addProductCheck = (el, key) => {
  searchProductByBarcodeOnkeyup(el, key, (result) => {
    if (result) {
      toastr.warning("Ürün zaten kayıtlıdır", result.name);
      document.getElementById("addProductButtonSubmit").disabled = true;
    } else {
      document.getElementById("addProductButtonSubmit").disabled = false;
    }
  });
};

let productAddModalClick = () => {
  openModal("productAddModal");
};

////**********  EDIT PRODUCT  ****************///

let editProductCheck = (el, key, barcode) => {
  searchProductByBarcodeOnkeyup(el, key, (result) => {
    if (result && result.barcode != barcode) {
      toastr.warning(
        "Ürün zaten " + result.name + " olarak kayıtlıdır",
        "Dikkat!"
      );
      document.getElementById("editProductButtonSubmit").disabled = true;
    } else {
      document.getElementById("editProductButtonSubmit").disabled = false;
    }
  });
};
let productEditModalClick = (data) => {
  openModal("productEditModal", data);
};

////**********  REMOVE PRODUCT  ****************///

let productRemoveModalClick = (data) => {
  openModal("productRemoveModal", data);
};

////**********  SHORTCUT PRODUCT  ****************///

let productShortCutModalClick = (data) => {
  openModal("productShortCutModal", data);
};

////**********  JOINT ACTIONS PRODUCT  ****************///

let openModal = async (id, data = false) => {
  var source = document.getElementById(id + "-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html;
  if (data) {
    html = await template(data);
  } else {
    html = await template();
  }

  document.getElementById("modals").innerHTML = html;
  $("#" + id).modal("show");
};

let closeModal = (id) => {
  $("#" + id).modal("hide");
  document.getElementById("modals").innerHTML = "";
};
