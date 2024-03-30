"use client"

import * as React from "react"
import {
    CaretSortIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Bookmark, ExternalLink, FileCode, FileVideo, RotateCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import supabase from "@/supabase"

function getCurrentURL() {
    return window.location.href
}

interface ProblemType {
    id: any;
    ProblemName: string
    Submission: string
    ProblemLink: string
    TopicTags: string[]
    Status: string
    Bookmark: boolean
    VideoEditorial: string
    Difficulty: number
}

function getRowColorClass(status) {
    switch (status) {
        case "Trying":
            return "bg-yellow-100"; // Yellow background for trying
        case "Solved":
            return "bg-green-100"; // Green background for solved
        case "Revise":
            return "bg-orange-100"; // Orange background for revise
        default:
            return ""; // No background for other statuses
    }
}

export default function CPSheetTable({ tableData, user_email, fullScreen, refresh }) {
    const [data, setData] = React.useState<ProblemType[]>(tableData ? tableData : [])

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns: ColumnDef<ProblemType>[] = [
        {
            id: "Bookmark",
            enableHiding: false,
            cell: ({ row }) => {
                const problem = row.original
                return (
                    <div className="flex items-center">
                        <button onClick={(e) => {
                            e.preventDefault()
                            toggleBookmark(problem?.ProblemLink, problem?.Bookmark, user_email)
                        }}>
                            {
                                refresh != 0 ?
                                    <Bookmark fill={problem?.Bookmark ? "#ADD8E6" : "#FFFFFF"} className="h-6 w-6" /> :
                                    <RotateCw className="animate-spin h-4 w-4" />
                            }
                        </button>
                    </div>
                )
            },
        },
        {
            id: "Status",
            enableHiding: false,
            accessorKey: "Status",
            cell: ({ row }) => {
                const problem = row.original
                return (
                    <div className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className="mb-2">
                                {refresh == 0 && <div className="flex items-center"><RotateCw className="animate-spin flex w-3 h-3 me-3" />Loading Status</div>}
                                {refresh != 0 && problem.Status == "Solved" && <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span> Solved</div>}
                                {refresh != 0 && problem.Status == "Trying" && <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-yellow-600 rounded-full"></span> Trying</div>}
                                {refresh != 0 && problem.Status == "Pending" && <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-blue-300 rounded-full"></span> Pending</div>}
                                {refresh != 0 && problem.Status == "Revise" && <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-orange-500 rounded-full"></span>Revise</div>}
                            </div>
                            {
                                refresh != 0 &&
                                <Select
                                    onValueChange={(e) => {
                                        updateStatus(problem?.ProblemLink, problem.Status, e)
                                    }}
                                >
                                    <SelectTrigger className="w-22 border-none h-5 underline">
                                        <p>update</p>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Solved">Solved</SelectItem>
                                            <SelectItem value="Trying">Trying</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Revise">Revise</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            }
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "ProblemName",
            enableHiding: false,
            enableSorting: true,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Problem Name
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const problem = row.original
                return (<>
                    <div className="flex items-center">

                        <a href={problem.ProblemLink} target="_blank" className="flex w-48 items-center">
                            <div className="overflow-clip text-left">
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger className="underline text-gray-600 text-left tracking-tight font-semibold">
                                            {(row.getValue("ProblemName"))}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{row.getValue("ProblemName")}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                    </div>
                </>)
            },
        },
        {
            accessorKey: "Difficulty",
            header: ({ column }) => {
                return (
                    <Button
                        className="w-32"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Difficulty
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const difficulty: number = row.getValue("Difficulty")
                return <div className="items-center text-center">
                    {difficulty <= 900 && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700"
                        >
                            {difficulty}
                        </span>
                    </div>}
                    {(difficulty <= 1200 && difficulty > 900) && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                        >
                            {difficulty}
                        </span>
                    </div>}
                    {(difficulty <= 1400 && difficulty > 1200) && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-cyan-100 px-2.5 py-0.5 text-sm text-cyan-700"
                        >
                            {difficulty}
                        </span>
                    </div>}
                    {(difficulty <= 1600 && difficulty > 1400) && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700"
                        >
                            {difficulty}
                        </span>
                    </div>}
                    {difficulty > 1600 && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-violet-100 px-2.5 py-0.5 text-sm text-violet-700"
                        >
                            {difficulty}
                        </span>
                    </div>}
                </div>
            },
        },
        {
            accessorKey: "Submission",
            header: ({ }) => {
                return (
                    <>
                        Code Link
                    </>
                )
            },
            cell: ({ row }) => {
                const problem = row.original
                return (
                    <div>
                        <a href={problem.Submission} target="_blank" className="rounded-lg"><Button className="flex rounded-xl w-full" variant={"outline"}>Solution <FileCode className="h-4 w-4 ml-2" /></Button></a>
                    </div>
                )
            },
        },
        {
            accessorKey: "VideoEditorial",
            header: ({ }) => {
                return (
                    <>
                        Video Editorial
                    </>
                )
            },
            cell: ({ row }) => {
                const problem = row.original
                return (
                    <div>
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <a href={problem.VideoEditorial} target="_blank" className="rounded-lg"><Button className="flex rounded-xl w-full" variant={"outline"}>Editorial <FileVideo className="h-4 w-4 ml-2" /></Button></a>
                        </div>
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const problem = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(problem?.ProblemLink);
                                    toast.info("Problem Link Copied")
                                }}
                            >
                                Copy Problem Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><a target="_blank" href={problem?.VideoEditorial}>View Editorial</a></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    async function toggleBookmark(problem_link, current, user_email) {
        if (current) {
            const { data: res, error } = await supabase
                .from('users')
                .select('bookmarked_problems')
                .eq('user_email', user_email)

            if (res) {
                let updated_bookmarked = res?.[0]?.bookmarked_problems
                if (updated_bookmarked.indexOf(problem_link) != -1)
                    updated_bookmarked = updated_bookmarked.filter((res) => {
                        if (res != problem_link) return true
                    })
                const { error } = await supabase
                    .from('users')
                    .update({ bookmarked_problems: updated_bookmarked })
                    .eq('user_email', user_email)
                    .select();
                if (error) {
                    console.log(error);
                    toast.error("Some error occurred")
                }
                else {
                    const tempData: ProblemType[] = data.map((problem) => {
                        if (problem?.ProblemLink == problem_link) {
                            return {
                                id: problem?.id,
                                ProblemName: problem?.ProblemName,
                                Submission: problem?.Submission,
                                ProblemLink: problem?.ProblemLink,
                                TopicTags: problem?.TopicTags,
                                Status: problem?.Status,
                                Bookmark: !current,
                                VideoEditorial: problem?.VideoEditorial,
                                Difficulty: problem?.Difficulty,
                            }
                        }
                        else
                            return problem
                    })
                    setData(tempData)
                }
            }
            else {
                console.log(error);
                toast.error("Some error occurred")
            }
        }
        else {
            const { data: res, error } = await supabase
                .from('users')
                .select('bookmarked_problems')
                .eq('user_email', user_email)

            if (res) {
                const updated_bookmarked = res?.[0]?.bookmarked_problems
                updated_bookmarked.push(problem_link)
                const { error } = await supabase
                    .from('users')
                    .update({ bookmarked_problems: updated_bookmarked })
                    .eq('user_email', user_email)
                    .select();
                if (error) {
                    console.log(error);
                    toast.error("Some error occurred")
                }
                else {
                    const tempData: ProblemType[] = data.map((problem) => {
                        if (problem?.ProblemLink == problem_link) {
                            return {
                                id: problem?.id,
                                ProblemName: problem?.ProblemName,
                                Submission: problem?.Submission,
                                ProblemLink: problem?.ProblemLink,
                                TopicTags: problem?.TopicTags,
                                Status: problem?.Status,
                                Bookmark: !current,
                                VideoEditorial: problem?.VideoEditorial,
                                Difficulty: problem?.Difficulty,
                            }
                        }
                        else
                            return problem
                    })
                    setData(tempData)
                }
            }
            else {
                console.log(error);
                toast.error("Some error occurred")
            }
        }
    }

    async function updateStatus(problem_link, from, to) {
        if (from == "Pending") {
            const { data: res } = await supabase
                .from('users')
                .select('pending_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.pending_problems
            if (updated.indexOf(problem_link) != -1)
                updated = updated.filter((res) => {
                    if (res != problem_link) return true
                })
            const { error } = await supabase
                .from('users')
                .update({ pending_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
        }
        if (from == "Trying") {
            const { data: res } = await supabase
                .from('users')
                .select('trying_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.trying_problems
            if (updated.indexOf(problem_link) != -1)
                updated = updated.filter((res) => {
                    if (res != problem_link) return true
                })
            const { error } = await supabase
                .from('users')
                .update({ trying_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
        }
        if (from == "Revise") {
            const { data: res } = await supabase
                .from('users')
                .select('revise_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.revise_problems
            if (updated.indexOf(problem_link) != -1)
                updated = updated.filter((res) => {
                    if (res != problem_link) return true
                })
            const { error } = await supabase
                .from('users')
                .update({ revise_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
        }
        if (from == "Solved") {
            const { data: res } = await supabase
                .from('users')
                .select('solved_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.solved_problems
            if (updated.indexOf(problem_link) != -1)
                updated = updated.filter((res) => {
                    if (res != problem_link) return true
                })
            const { error } = await supabase
                .from('users')
                .update({ solved_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
        }

        if (to == "Pending") {
            const { data: res } = await supabase
                .from('users')
                .select('pending_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.pending_problems
            updated.push(problem_link)
            const { error } = await supabase
                .from('users')
                .update({ pending_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
            else {
                const tempData: ProblemType[] = data.map((problem) => {
                    if (problem?.ProblemLink == problem_link) {
                        return {
                            id: problem?.id,
                            ProblemName: problem?.ProblemName,
                            Submission: problem?.Submission,
                            ProblemLink: problem?.ProblemLink,
                            TopicTags: problem?.TopicTags,
                            Status: to,
                            Bookmark: problem?.Bookmark,
                            VideoEditorial: problem?.VideoEditorial,
                            Difficulty: problem?.Difficulty,
                        }
                    }
                    else
                        return problem
                })
                setData(tempData)
            }
        }
        if (to == "Trying") {
            const { data: res } = await supabase
                .from('users')
                .select('trying_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.trying_problems
            updated.push(problem_link)
            const { error } = await supabase
                .from('users')
                .update({ trying_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
            else {
                const tempData: ProblemType[] = data.map((problem) => {
                    if (problem?.ProblemLink == problem_link) {
                        return {
                            id: problem?.id,
                            ProblemName: problem?.ProblemName,
                            Submission: problem?.Submission,
                            ProblemLink: problem?.ProblemLink,
                            TopicTags: problem?.TopicTags,
                            Status: to,
                            Bookmark: problem?.Bookmark,
                            VideoEditorial: problem?.VideoEditorial,
                            Difficulty: problem?.Difficulty,
                        }
                    }
                    else
                        return problem
                })
                setData(tempData)
            }
        }
        if (to == "Revise") {
            const { data: res } = await supabase
                .from('users')
                .select('revise_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.revise_problems
            updated.push(problem_link)
            const { error } = await supabase
                .from('users')
                .update({ revise_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
            else {
                const tempData: ProblemType[] = data.map((problem) => {
                    if (problem?.ProblemLink == problem_link) {
                        return {
                            id: problem?.id,
                            ProblemName: problem?.ProblemName,
                            Submission: problem?.Submission,
                            ProblemLink: problem?.ProblemLink,
                            TopicTags: problem?.TopicTags,
                            Status: to,
                            Bookmark: problem?.Bookmark,
                            VideoEditorial: problem?.VideoEditorial,
                            Difficulty: problem?.Difficulty,
                        }
                    }
                    else
                        return problem
                })
                setData(tempData)
            }
        }
        if (to == "Solved") {
            const { data: res } = await supabase
                .from('users')
                .select('solved_problems')
                .eq('user_email', user_email)
            let updated = res?.[0]?.solved_problems
            updated.push(problem_link)
            const { error } = await supabase
                .from('users')
                .update({ solved_problems: updated })
                .eq('user_email', user_email)
                .select();
            if (error) {
                toast.error("Some error occurred")
            }
            else {
                const tempData: ProblemType[] = data.map((problem) => {
                    if (problem?.ProblemLink == problem_link) {
                        return {
                            id: problem?.id,
                            ProblemName: problem?.ProblemName,
                            Submission: problem?.Submission,
                            ProblemLink: problem?.ProblemLink,
                            TopicTags: problem?.TopicTags,
                            Status: to,
                            Bookmark: problem?.Bookmark,
                            VideoEditorial: problem?.VideoEditorial,
                            Difficulty: problem?.Difficulty,
                        }
                    }
                    else
                        return problem
                })
                setData(tempData)
            }
        }


    }

    return (
        <div className="w-full">
            {
                !fullScreen &&
                <div className="lg:flex items-center py-4 gap-x-5">
                    <div className="flex lg:mt-0 mt-3 flex-col">
                        <Label htmlFor="statusfilter" className="mb-2">Filter Status</Label>
                        <Select
                            value={(table.getColumn("Status")?.getFilterValue() as string) ?? ""}
                            onValueChange={(event) => {
                                if (event == "All") {
                                    table.getColumn("Status")?.setFilterValue("")
                                }
                                else {
                                    table.getColumn("Status")?.setFilterValue(event)
                                }
                            }
                            }
                        >
                            <SelectTrigger className="lg:w-36 w-full" id="statusfilter">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Solved">Solved</SelectItem>
                                    <SelectItem value="Trying">Trying</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Revise">Revise</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="lg:mt-0 mt-3 flex flex-col">
                        <Label className="mb-2">Search Problem Name</Label>
                        <Input
                            placeholder="Search problems..."
                            value={(table.getColumn("ProblemName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("ProblemName")?.setFilterValue(event.target.value)
                            }
                            className="lg:w-64 w-full "
                        />
                    </div>
                    <div className="grid md:grid-cols-3 grid-cols-2 gap-x-5 lg:mt-0 mt-3 ">
                        <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-blue-500 rounded-full"></span> All Problems: {data?.length}</div>
                        <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span> Solved Problems: {data.filter((data) => { if (data?.Status == "Solved") return true }).length}</div>
                        <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-yellow-600 rounded-full"></span> Problems Trying: {data.filter((data) => { if (data?.Status == "Trying") return true }).length}</div>
                        <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-blue-300 rounded-full"></span> Pending Problems: {data.filter((data) => { if (data?.Status == "Pending") return true }).length}</div>
                        <div className="flex items-center"><span className="flex w-3 h-3 me-3 bg-orange-500 rounded-full"></span>Problems to Revise: {data.filter((data) => { if (data?.Status == "Revise") return true }).length}</div>
                    </div>
                    {/* <DropdownMenu>
                    <DropdownMenuTrigger className="lg:mt-0 w-full lg:w-32 mt-3 " asChild>
                        <Button variant="outline" className="ml-auto">
                            <Settings2 className="mr-2 h-4 w-4" /> View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu> */}
                </div>
            }
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={getRowColorClass(row.original.Status) + " cursor-pointer"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Total {table.getFilteredRowModel().rows.length} Problems
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
