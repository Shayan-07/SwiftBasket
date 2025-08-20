import Editor, {
    Toolbar,
    BtnBold,
    BtnItalic,
    BtnUnderline,
    BtnStrikeThrough,
    BtnNumberedList,
    BtnBulletList,
    BtnLink,
    BtnClearFormatting,
    BtnUndo,
    BtnRedo,
    BtnStyles,
    HtmlButton
} from 'react-simple-wysiwyg';

const EditorBox = ({ field, placeholderTxt }) => {
    return (
        <Editor
            id="description"
            value={field?.value}
            onChange={field?.onChange}
            className="text-[1.4rem] text-[#555] min-h-[200px] font-medium w-full py-4 border border-t-0 border-[rgba(0,0,0,0.5)] placeholder:text-[#999] !outline-0"
            placeholder={placeholderTxt}
        >
            <Toolbar>
                <BtnUndo />
                <BtnRedo />
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnStrikeThrough />
                <BtnNumberedList />
                <BtnBulletList />
                <BtnLink />
                <BtnClearFormatting />
                <HtmlButton />
                <BtnStyles />
            </Toolbar>
        </Editor>
    );
};

export default EditorBox;
