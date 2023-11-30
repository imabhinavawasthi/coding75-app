import { CodeIcon, Link, LinkIcon, PackageIcon, VideoIcon } from "lucide-react";

const ProjectCard = ({ project }) => {
    return (
        <div>

            <article
                className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
            >
                <div className="rounded-[10px] bg-white p-4  sm:p-6">
                    {project?.project_level == "Beginner" && <strong
                        className="rounded border border-green-500 bg-green-500 px-3 py-1.5 text-[10px] font-medium text-white"
                    >
                        {project?.project_level}
                    </strong>
                    }
                    {project?.project_level == "Intermediate" && <strong
                        className="rounded border border-orange-500 bg-orange-500 px-3 py-1.5 text-[10px] font-medium text-white"
                    >
                        {project?.project_level}
                    </strong>
                    }
                    {project?.project_level == "Expert" && <strong
                        className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                    >
                        {project?.project_level}
                    </strong>
                    }

                    <div >
                        <h3 className="mt-3 text-lg font-medium text-gray-900">
                            {project?.project_name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-700">{project?.project_description}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                        {project.tech_used["tech"]?.map((tech, index) => (
                            <div
                                key={index}>
                                <span
                                    className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
                                >
                                    {tech}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {project?.video_link && <a href={project?.video_link} target="_blank" className="rounded border flex gap-2 text-xs border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white">
                            <VideoIcon className="text-xs w-4 h-4" /> Video
                        </a>}
                        {project?.code_link&&<a href={project?.code_link} target="_blank" className="rounded border flex gap-2 text-xs border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white">
                            <CodeIcon className="text-xs w-4 h-4" /> Code
                        </a>}
                        {project?.blog_link&&<a href={project?.blog_link} target="_blank" className="rounded border flex gap-2 text-xs border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white">
                            <PackageIcon className="text-xs w-4 h-4" /> Blog
                        </a>}
                        {project?.deploy_link&&<a href={project?.deploy_link} target="_blank" className="rounded border flex gap-2 text-xs border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white">
                            <LinkIcon className="text-xs w-4 h-4" /> Deploy
                        </a>}
                    </div>
                </div>
            </article>
        </div>
    );
}

export default ProjectCard;