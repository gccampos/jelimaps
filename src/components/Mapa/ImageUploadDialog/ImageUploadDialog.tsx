import React, { Component } from "react";
import { DropzoneDialog } from "material-ui-dropzone";

class ImageUploadDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
    };
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleSave(files) {
    this.setState({
      files: files,
      open: false,
    });
  }

  handleOpen() {
    this.setState({
      open: true,
    });
  }

  render() {
    return (
      <div>
        <DropzoneDialog
          open={true}
          onSave={this.handleSave.bind(this)}
          acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={this.handleClose.bind(this)}
          filesLimit={1}
          cancelButtonText="Cancelar"
          dropzoneText="Arraste uma imagem para esta área ou clique para realizar upload de imagem"
          submitButtonText="Salvar"
          dialogTitle={"Imagem de Mapa"}
        />
      </div>
    );
  }
}

export default ImageUploadDialog;
