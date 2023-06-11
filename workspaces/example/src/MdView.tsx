import { useRemark } from "react-remark"
import { useGetText } from "./hooks"

type TMdViewProps = {
    path: string
}

/** View a markdown file */
export default function MdView({ path }: TMdViewProps) {
    const mdText = useGetText(path)
    const [reactContent, setMarkdownSource] = useRemark()

    if (mdText === undefined) {
        return <div>...Loading...</div>
    }
    setMarkdownSource(mdText)
    return <div>
        {reactContent}
    </div>
}