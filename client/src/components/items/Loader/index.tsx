import { Spinner } from "@/components/ui/spinner";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';

type Props = {}

const Loader = (props: Props) => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Empty className="w-full text-primary-text">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Spinner />
                    </EmptyMedia>
                    <EmptyTitle>Processing your request</EmptyTitle>
                    <EmptyDescription>
                        Please wait while we process your request. Do not refresh the page.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Link className='flex items-center gap-2 p-2! outline w-fit rounded-lg hover:bg-brown-dark hover:text-white transition-all font-semibold text-xs' to={-1}>
                        <FaArrowLeftLong /> Back
                    </Link>
                </EmptyContent>
            </Empty>
        </div>
    )
}

export default Loader