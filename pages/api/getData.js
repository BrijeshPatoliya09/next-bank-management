    import dbConnect from "../../helper/connection";

    export default async (req, res) => {
    try {
        const mango = {
        selector: {
            docType: "Bank",
        },
        sort: ["level"],
        };
        const data = await dbConnect().mango("bank-management", mango);

        const dummy = data.data.docs
        .filter((item) => item.level == 1)
        .map((item) => {
            const levData = data.data.docs
            .filter((item2) => item2.level == 2)
            .map((item2) => {
                const levData = data.data.docs
                .filter(
                    (item3) =>
                    item3.level == 3 &&
                    item3.address.country == item2.address.country
                )
                .map((item3) => {
                    const levData = data.data.docs
                    .filter(
                        (item4) =>
                        item4.level == 4 &&
                        item4.address.state == item3.address.state
                    )
                    .map((item4) => {
                        const levData = data.data.docs.filter(
                        (item5) =>
                            item5.level == 5 &&
                            item5.address.zone == item4.address.zone
                        );

                        return {
                        ...item4,
                        bankInfo: levData,
                        };
                    });
                    return {
                    ...item3,
                    bankInfo: levData,
                    };
                });
                return {
                ...item2,
                bankInfo: levData,
                };
            });
            return {
            ...item,
            bankInfo: levData,
            };
        });

        res.status(200).json({ status: true, message: "success", data: dummy });
    } catch (err) {
        console.log(err);
        res.status(404).json({ status: false, message: "Something went wrong" });
    }
    };
