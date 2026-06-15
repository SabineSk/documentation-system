import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HolidayTable(){

    return(
        <div className="content">
            <table>
                <tbody>
                    <tr>
                        <th>

                        </th>
                        <th>
                            Nosaukums
                        </th>
                        <th>
                            Valsts
                        </th>
                        <th>
                            Datums
                        </th>
                        <th>
                            Tips
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>

    )

}
export default HolidayTable;
