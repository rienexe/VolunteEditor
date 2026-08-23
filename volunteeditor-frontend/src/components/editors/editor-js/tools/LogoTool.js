import ImageTool from '@editorjs/image';



export default class LogoTool extends ImageTool {
    render() {
        const wrapper = super.render();
        wrapper.classList.add('logo-tool');

        const img = wrapper.querySelector('.image-tool__image-picture');
        if (img) {
            img.classList.add('logo-tool__image-picture');
        }

        return wrapper;
    }
}