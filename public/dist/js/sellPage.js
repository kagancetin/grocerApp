document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("barcode").onkeyup = (event) => {
    el = event.target;
    searchProductByBarcodeOnkeyup(el, event.code, (result) => {
      if (result) {
        addSalesList(result);
        clearBarcode();
      } else {
      }
    });
  };

  document.body.addEventListener("keypress", (e) => {
    if (e.target.nodeName != "INPUT") {
      var a = document.querySelector('a[data-shurtcut="' + e.key + '"]');
      if (a) {
        a.click();
      }
    }
  });
  allBarcodeWithoutProductsListRef();
});

let addSalesList = async (product) => {
  var source = document.getElementById("salesList-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template(product);
  document.getElementById("salesList").innerHTML += html;
  salesListRef(document.getElementById("salesList"));
};

let plusIconClick = (e) => {
  let addone = parseFloat(e.previousElementSibling.value) + 1;
  e.previousElementSibling.value = addone;
  e.previousElementSibling.setAttribute("value", addone);
  calculateCurrentPrice(e.previousElementSibling);
};

let minusIconClick = (e) => {
  let unit = parseFloat(e.nextElementSibling.value);
  if (unit >= 1.01) {
    let outofone = unit - 1;
    if (outofone.toString().split(".")[1] > 2) {
      e.nextElementSibling.value = outofone.toFixed(2);
      e.nextElementSibling.setAttribute("value", outofone.toFixed(2));
      calculateCurrentPrice(e.nextElementSibling);
    } else {
      e.nextElementSibling.value = outofone;
      e.nextElementSibling.setAttribute("value", outofone);
      calculateCurrentPrice(e.nextElementSibling);
    }
  }
};

let calculateCurrentPrice = (e) => {
  let related_tr = getParentByNodeName(e, "TR");
  let related_td = related_tr.querySelector(`[data-current-price]`);
  e.value = e.value == "" ? 1 : e.value;
  let inputNumber = e.value;
  e.setAttribute("value", inputNumber);
  let currentPrice = parseFloat(
    inputNumber * e.getAttribute("data-price")
  ).toFixed(2);
  related_td.innerHTML = currentPrice + " &#8378";
  related_td.setAttribute("data-current-price", currentPrice);
  salesListRef(document.getElementById("salesList"));
};

let getParentByNodeName = (e, nodeName) => {
  var cur = e.parentNode;
  while (cur) {
    cur = cur.parentNode;
    if (cur.nodeName == nodeName) break;
  }
  return cur;
};

let removeFromList = (e) => {
  let related_tr = getParentByNodeName(e, "TR");
  related_tr.remove();
  salesListRef(document.getElementById("salesList"));
};

let salesListRef = (e) => {
  all_td = e.querySelectorAll(`[data-current-price]`);
  let sumPrice = document.getElementById("sumPrice");
  let sumPriceValue = 0;
  for (let i = 0; i < all_td.length; i++) {
    let price = all_td[i].getAttribute("data-current-price");
    sumPriceValue += parseFloat(price);
  }
  sumPrice.innerHTML =
    sumPriceValue == 0 ? "" : sumPriceValue.toFixed(2) + " &#8378";
  sumPrice.setAttribute("data-sum-price", sumPriceValue.toFixed(2));
  changeSales(0);
};

let allBarcodeWithoutProductsListRef = () => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/allBarcodeWithoutProducts", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = async function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let responseData = JSON.parse(this.response);

      var source = document.getElementById(
        "allBarcodeWithoutProductsList-template"
      ).innerHTML;
      var template = await Handlebars.compile(source);
      let data = responseData.map((part) => {
        part.JsonData = JSON.stringify(part);
        return part;
      });
      var html = await template(responseData);
      document.getElementById("allBarcodeWithoutProductsList").innerHTML = html;
    }
  };

  xhr.send();
};

let submitSales = () => {
  let salesList = document.querySelectorAll("#salesList tr");
  if (salesList.length > 0) {
    let data = {};
    data.salesList = [];
    data.sumPrice = document.getElementById("sumPrice").dataset.sumPrice;
    salesList.forEach((part) => {
      data.salesList.push({
        product: part.querySelector("td[data-id]").dataset.id,
        unit: part.querySelector("#unit").value,
        sellPrice: part.querySelector("input[data-price]").dataset.price,
        currentPrice: part.querySelector("td[data-current-price]").dataset
          .currentPrice,
      });
    });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/transactions/addSales", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = async function () {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        if (this.response) {
          let responseData = JSON.parse(this.response);
          toastr.success("Satış işlemi başarıyla gerçekleşmiştir", "Başarılı!");
          clSales();
        } else {
          toastr.error(
            "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyiniz",
            "Hata!"
          );
        }
      }
    };

    xhr.send(JSON.stringify(data));
  } else {
    toastr.warning("Lütfen ürün giriniz!", "Dikkat!");
  }
};

let clSales = () => {
  let salesList = document.querySelector("#salesList");
  salesList.innerHTML = "";
  salesListRef(salesList);
  changeSales(-1);
};
