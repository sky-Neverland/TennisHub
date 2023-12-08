import Dropzone from "./Dropzone/Dropzone";
import Grid from "./Grid/Grid";
import HeaderSearch from "./HeaderSearch/HeaderSearch";
import ModelCard from "./ModelCard/ModelCard";
import DeleteButton, { DeleteButtonProps as IDeleteButton} from "./DeleteButton";
import PrivateButton, { PrivateButtonProps as IPrivateButton } from "./PrivateButton";
import TrackButton, { TrackButtonProps as ITrackButton } from "./TrackButton";

interface DeleteButtonProps extends IDeleteButton {};
interface PrivateButtonProps extends IPrivateButton {};
interface TrackButtonProps extends ITrackButton {};

export {
    Dropzone,
    Grid,
    HeaderSearch,
    ModelCard,
    DeleteButton,
    PrivateButton,
    TrackButton,
    DeleteButtonProps,
    PrivateButtonProps,
    TrackButtonProps,
};
