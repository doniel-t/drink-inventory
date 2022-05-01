import colors from "../../utils/Colors";
import PropTypes from "prop-types";

import viewStates from "../../utils/ViewStates";
import { getBase64 } from "../../utils/Base64";
import { addDrink } from "../../utils/ApiHandler";

import { useState } from "react";

import NameFormInput from "./FormInputs/NameFormInput";
import AmountFormInput from "./FormInputs/AmountFormInput";
import URLFormInput from "./FormInputs/URLFormInput";
import ImageFormInput from "./FormInputs/ImageFormInput";
import TypeFormInput from "./FormInputs/TypeFormInputs";
import SubmitButton from "./FormInputs/SubmitButton";

function PopupForm({
  setAlcDrinks,
  alcDrinks,
  setMixDrinks,
  mixDrinks,
  imageMap,
  setImageMap,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [url, setURL] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [type, setType] = useState(viewStates.alcoholView);

  function isValid(formInputType) {
    switch (formInputType) {
      case "name":
        return name.length > 0;
      case "amount":
        if (amount !== undefined || amount != null) {
          setAmount(parseInt(amount));
        }
        return typeof amount === "number";
      case "image":
        return imageFile.name.endsWith(".png");
      case "url":
        return url.length > 0 && url.includes("https://www.amazon.de");
      default:
        return false;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const isValidFormInput =
      isValid("name") &&
      isValid("amount") &&
      isValid("image") &&
      isValid("url");

    if (!isValidFormInput) return;

    getBase64(imageFile).then((base64) => {
      console.log(base64.substring(0, 100));
      let newDrink = {
        name: name,
        amount: amount,
        imageBase64: base64,
        url: url,
        type: type,
      };

      addDrink(newDrink)
        .then((res) => {
          if (res.status === 201) {
            //update imageMap with uploaded image
            imageMap[newDrink.name] = newDrink.imageBase64;
            setImageMap(imageMap);
            if (type === viewStates.alcoholView) {
              setAlcDrinks([...alcDrinks, newDrink]);
            } else {
              setMixDrinks([...mixDrinks, newDrink]);
            }
          }
          console.log(res.status);
          console.log("form submitted");
        })
        .catch((err) => console.log(err));
    });
  }

  return (
    <div className="border-none translate-x-[calc(-1*(50vw-50%))]">
      <div
        className="font-bold rounded-lg border-2 shadow-2xl py-12 px-32"
        style={{
          backgroundColor: colors.cardBackground,
          color: colors.lightText,
        }}
      >
        <p className="text-2xl mb-8 text-center">Please add a Drink! 🚀</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 grid-rows-3">
          <NameFormInput name={name} setName={setName} />
          <AmountFormInput setAmount={setAmount} />
          <URLFormInput setURL={setURL} url={url} />
          <ImageFormInput setImageFile={setImageFile} />
          <TypeFormInput setType={setType} type={type} />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

PopupForm.propTypes = {
  setAlcDrinks: PropTypes.func.isRequired,
  alcDrinks: PropTypes.array.isRequired,
  setMixDrinks: PropTypes.func.isRequired,
  mixDrinks: PropTypes.array.isRequired,
  imageMap: PropTypes.object.isRequired,
  setImageMap: PropTypes.func.isRequired,
};

export default PopupForm;