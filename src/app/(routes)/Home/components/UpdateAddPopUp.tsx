import { ButtonComponent } from "@/components/ButtonComponent";
import { isPopupOpenType, setPopupOpen } from "@/redux/slices/homePageSlice";
import { RootState } from "@/redux/store";
import { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

export const UpdateAddPopUp = (): JSX.Element => {
  const isPopupOpen = useSelector(
    (state: RootState) => state.homePageSlice.isPopupOpen
  );
  const dispatch = useDispatch();

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-yellow-400 z-50 opacity-45 ">
      <p> {isPopupOpen.isPopupOpen} </p>
      <p> {isPopupOpen.isUpdate} </p>
      <ButtonComponent
        onClick={() => {
          dispatch(
            setPopupOpen({
              isPopupOpen: false,
              isUpdate: false,
            })
          );
        }}
        text="Kapat"
      />
    </div>
  );
};

export default UpdateAddPopUp;
