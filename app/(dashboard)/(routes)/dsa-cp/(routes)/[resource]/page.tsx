
const ResourcePage = (params: any) => {
    return (
        <div className="container">
            <div className="m-5">
                {params.params.resource}
            </div>
        </div>
    );
}

export default ResourcePage;