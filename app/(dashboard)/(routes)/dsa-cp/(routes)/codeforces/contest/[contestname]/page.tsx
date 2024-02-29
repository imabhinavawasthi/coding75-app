
const ContestPage = (params: any) => {
    return (
        <div className="container">
            <div className="m-5">
                {params.params.contestname}
            </div>
        </div>
    );
}

export default ContestPage;