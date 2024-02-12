"use client"

import * as React from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ExternalLink, FileVideo, Settings2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"


function truncate(s: any) {
    if (s.length > 30) {
        return s.substring(0, 30) + "..."
    }
    return s
}

function getCurrentURL() {
    return window.location.href
}

export default function ProblemTable({ data }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    type Problem = {
        ProblemName: string
        PlatformName: string
        ProblemLink: string
        TopicTags: string[]
        CompanyTags: string[]
        Status: string
        SlugUrl: string
        Editorial: string
        VideoEditorial: string
        Difficulty: number
    }

    const columns: ColumnDef<Problem>[] = [
        {
            id: "status",
            enableHiding: false,
            accessorKey: "Status",
            cell: ({ row }) => {
                const problem = row.original
                return (
                    <div className="flex items-center">
                        {problem.Status == "Solved" && <span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span>}
                        {problem.Status == "Trying" && <span className="flex w-3 h-3 me-3 bg-blue-600 rounded-full"></span>}
                        {problem.Status == "Pending" && <span className="flex w-3 h-3 me-3 bg-yellow-300 rounded-full"></span>}
                        {problem.Status == "Revise" && <span className="flex w-3 h-3 me-3 bg-indigo-500 rounded-full"></span>}
                        <Select>
                            <SelectTrigger className="w-28">
                                <SelectValue defaultValue={problem.Status} placeholder={problem.Status} />
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
                        <a href={problem.ProblemLink} target="_blank"><ExternalLink className="h-4 w-4 mr-5" /></a>
                        <div className="overflow-clip w-48 text-left">
                            <TooltipProvider delayDuration={0}>
                                <Link href={"/dsa-cp/problems/" + problem.SlugUrl}>
                                    <Tooltip>
                                        <TooltipTrigger className="text-gray-600 text-left tracking-tight font-semibold">
                                            {(row.getValue("ProblemName"))}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{row.getValue("ProblemName")}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </Link>
                            </TooltipProvider>
                        </div>
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
                const difficulty = row.getValue("Difficulty")
                return <div className="items-center text-center">
                    {difficulty == 0 && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                        >
                            {"Easy"}
                        </span>
                    </div>}
                    {difficulty == 1 && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700"
                        >
                            {"Medium"}
                        </span>
                    </div>}
                    {difficulty == 2 && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-sm text-red-700"
                        >
                            {"Hard"}
                        </span>
                    </div>}
                    {difficulty == 3 && <div>
                        <span
                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700"
                        >
                            {"Advanced"}
                        </span>
                    </div>}
                </div>
            },
        },
        {
            accessorKey: "TopicTags",
            header: ({ }) => {
                return (
                    <>
                        Topic Tags
                    </>
                )
            },
            cell: ({ row }) => {
                const topic_tags: [] = row.getValue("TopicTags")
                return (
                    <div>
                        {topic_tags?.map((value, index) => (
                            <div
                                key={index}
                                className="mb-2"
                            >

                                <p className="text-xs">
                                    <span
                                        className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-700 "
                                    >
                                        {value}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )
            },
        },
        {
            accessorKey: "CompanyTags",
            header: ({ }) => {
                return (
                    <>
                        Company Tags
                    </>
                )
            },
            cell: ({ row }) => {
                const company_tags: [] = row.getValue("CompanyTags")
                return (
                    <div>
                        {company_tags.map((value, index) => (
                            <div
                                key={index}
                                className="mb-2"
                            >

                                <p className="text-xs">
                                    <span
                                        className="whitespace-nowrap rounded-full bg-yellow-100 px-2.5 py-0.5 text-yellow-700 "
                                    >
                                        {value}
                                    </span>
                                </p>
                            </div>
                        ))}
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
                            <a href={problem.VideoEditorial ? problem.VideoEditorial : problem.Editorial} target="_blank" className="rounded-lg"><Button className="flex rounded-xl w-full" variant={"outline"}>Editorial <FileVideo className="h-4 w-4 ml-2" /></Button></a>
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
                                    const url = getCurrentURL() + "/" + problem.SlugUrl
                                    navigator.clipboard.writeText(url);
                                    toast.info("Problem Link Copied")
                                }}
                            >
                                Copy Problem Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link href={"/dsa-cp/problems/" + problem.SlugUrl}>View Problem</Link></DropdownMenuItem>
                            <DropdownMenuItem>View problem details</DropdownMenuItem>
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

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search problems..."
                    value={(table.getColumn("ProblemName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("ProblemName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
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
                </DropdownMenu>
            </div>
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
