import React, { useMemo } from 'react';
import type { IGrade } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Moment from 'react-moment';
import { FaInfoCircle } from 'react-icons/fa';

interface GradePopoverProps {
    grade: IGrade;
}

const GradePopover: React.FC<GradePopoverProps> = ({ grade }) => {
    const gradeColorClass = useMemo(() => {
        if (grade.value >= 4) return 'bg-green-500 hover:bg-green-600';
        if (grade.value === 3) return 'bg-yellow-500 hover:bg-yellow-600';
        return 'bg-red-500 hover:bg-red-600';
    }, [grade.value]);

    return (
        <Popover key={grade.id}>
            <PopoverTrigger asChild>
                <Button size={'sm'} className={`w-7 cursor-pointer ${gradeColorClass}`} variant="outline">{grade.value}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2!">
                <div className="grid gap-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                        <FaInfoCircle className="text-primary-light" />
                        <h4 className="font-semibold text-lg">Grade Details</h4>
                    </div>

                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Info:</h4>

                        {grade.comment && <p className="text-muted-foreground text-sm">
                            <span className='font-bold'>comment: </span>
                            {grade.comment}
                        </p>}

                        <p className="text-muted-foreground text-sm">
                            <span className='font-bold'>date: </span>
                            <Moment format='DD/MM/YYYY' date={new Date(grade.date)} />
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default GradePopover